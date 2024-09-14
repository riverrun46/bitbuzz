/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem, BuzzData } from './BuzzForm'
// import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay-ts'
// import dayjs from 'dayjs';
import { useAtom, useAtomValue } from 'jotai'
import { isEmpty, isNil } from 'ramda'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { connectedNetworkAtom, globalFeeRateAtom } from '../../store/user'
// import { sleep } from '../../utils/time';
import { SubmitHandler, useForm } from 'react-hook-form'
import { image2Attach, removeFileFromList } from '../../utils/file'
import useImagesPreview from '../../hooks/useImagesPreview'
import {
  CreateOptions,
  IBtcConnector,
  IBtcEntity,
  IMvcConnector,
  IMvcEntity,
  MvcTransaction,
} from '@metaid/metaid'
import { environment, getServiceAddress } from '../../utils/environments'
import { Pin } from '../../api/request'
import { Connector } from '../../types'

type Iprops = {
  connector: Connector
  quotePin?: Pin
}

const BuzzFormWrap = ({ connector, quotePin }: Iprops) => {
  const isQuoted = !isNil(quotePin)

  const [isAdding, setIsAdding] = useState(false)
  const [connectedNetwork] = useAtom(connectedNetworkAtom)

  const globalFeerate = useAtomValue(globalFeeRateAtom)
  const queryClient = useQueryClient()
  const buzzFormHandle = useForm<BuzzData>()
  const files = buzzFormHandle.watch('images')

  const [filesPreview, setFilesPreview] = useImagesPreview(files)

  const onClearImageUploads = () => {
    setFilesPreview([])
    buzzFormHandle.setValue('images', [] as any)
  }

  const onCreateSubmit: SubmitHandler<BuzzData> = async (data) => {
    // console.log('submit raw image', data.images);
    const images =
      data.images.length !== 0 ? await image2Attach(data.images) : []
    // console.log('submit process image',  images);

    await handleAddBuzz({
      content: data.content,
      images,
    })
  }

  const handleAddBuzz = async (buzz: {
    content: string
    images: AttachmentItem[]
  }) => {
    setIsAdding(true)
    console.log('connectedNetwork', connectedNetwork)
    console.log('connector', connector)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalBody: any = {
        content: buzz.content,
        contentType: 'text/plain',
      }
      let fileTransactions: MvcTransaction[] = []

      if (!isEmpty(buzz.images)) {
        const fileOptions: CreateOptions[] = []

        for (const image of buzz.images) {
          fileOptions.push({
            body: Buffer.from(image.data, 'hex').toString('base64'),
            contentType: `${image.fileType};binary`,
            encoding: 'base64',
            flag: environment.flag,
          })
        }
        if (connectedNetwork === 'btc') {
          const fileEntity = (await connector!.use('file')) as IBtcEntity

          const imageRes = await fileEntity.create({
            dataArray: fileOptions,
            options: {
              noBroadcast: 'no',
              feeRate: Number(globalFeerate),
              service: {
                address: getServiceAddress(),
                satoshis: environment.service_satoshi,
              },
              // network: environment.network,
            },
          })

          console.log('imageRes', imageRes)
          finalBody.attachments = imageRes.revealTxIds.map(
            (rid) => 'metafile://' + rid + 'i0',
          )
        } else if (connectedNetwork === 'mvc') {
          const fileEntity = (await connector!.use('file')) as IMvcEntity
          const finalAttachMetafileUri: string[] = []

          for (let i = 0; i < fileOptions.length; i++) {
            const fileOption = fileOptions[i]

            const { transactions } = await fileEntity.create({
              data: fileOption,
              options: {
                network: environment.network,
                signMessage: 'upload image file',
                serialAction: 'combo',
                transactions: fileTransactions,
              },
            })

            if (!transactions) {
              throw new Error('upload image file failed')
            }

            finalAttachMetafileUri.push(
              'metafile://' +
                transactions[transactions.length - 1].txComposer.getTxId() +
                'i0',
            )
            fileTransactions = transactions
          }

          finalBody.attachments = finalAttachMetafileUri
        }
      }
      //   await sleep(5000);

      console.log('finalBody', finalBody)
      console.log('connectedNetwork', connectedNetwork)
      if (!isNil(quotePin)) {
        finalBody.quotePin = quotePin.id
      }

      if (connectedNetwork === 'btc') {
        const buzzEntity = (await connector.use('buzz')) as IBtcEntity
        const createRes = await buzzEntity!.create({
          dataArray: [
            {
              body: JSON.stringify(finalBody),
              contentType: 'text/plain;utf-8',
              flag: environment.flag,
            },
          ],
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeerate),
            service: {
              address: getServiceAddress(),
              satoshis: environment.service_satoshi,
            },
            // network: environment.network,
          },
        })
        console.log('create res for inscribe', createRes)
        if (!isNil(createRes?.revealTxIds[0])) {
          // await sleep(5000);
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          toast.success(`${isQuoted ? 'repost' : 'create'} buzz successfully`)
          buzzFormHandle.reset()
          onClearImageUploads()

          const doc_modal = document.getElementById(
            isQuoted ? 'repost_buzz_modal_' + quotePin.id : 'new_buzz_modal',
          ) as HTMLDialogElement
          doc_modal.close()
        }
      } else if (connectedNetwork === 'mvc') {
        const buzzEntity = (await connector.use('buzz')) as IMvcEntity
        console.log('buzzEntity', buzzEntity)
        console.log('connector', connector)

        const createRes = await buzzEntity!.create({
          data: { body: JSON.stringify(finalBody) },
          options: {
            network: environment.network,
            signMessage: 'create buzz',
            serialAction: 'finish',
            transactions: fileTransactions,
          },
        })
        console.log('create res for inscribe', createRes)
        if (!isNil(createRes?.txid)) {
          // await sleep(5000);
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          toast.success(`${isQuoted ? 'repost' : 'create'} buzz successfully`)
          buzzFormHandle.reset()
          onClearImageUploads()

          const doc_modal = document.getElementById(
            isQuoted ? 'repost_buzz_modal_' + quotePin.id : 'new_buzz_modal',
          ) as HTMLDialogElement
          doc_modal.close()
        }
      }
    } catch (error) {
      console.log('error', error)
      const errorMessage = (error as any)?.message ?? error
      const toastMessage = errorMessage?.includes(
        'Cannot read properties of undefined',
      )
        ? 'User Canceled'
        : errorMessage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(toastMessage, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      })
      setIsAdding(false)
    }
    setIsAdding(false)
  }

  // console.log('select feerate', selectFeeRate);
  // console.log('feerate data', feeRateData);
  const handleRemoveImage = (index: number) => {
    setFilesPreview(filesPreview.filter((_, i) => i !== index))
    buzzFormHandle.setValue(
      'images',
      removeFileFromList(buzzFormHandle.watch('images'), index),
    )
    // remove item from  files object with index
  }

  return (
    <LoadingOverlay active={isAdding} spinner text='Creating Buzz...'>
      <BuzzForm
        onCreateSubmit={onCreateSubmit}
        handleRemoveImage={handleRemoveImage}
        buzzFormHandle={buzzFormHandle}
        onClearImageUploads={onClearImageUploads}
        filesPreview={filesPreview}
        quotePin={quotePin}
      />
    </LoadingOverlay>
  )
}

export default BuzzFormWrap

// const AddBuzz = () => {
// 	const queryClient = useQueryClient();

// 	const createBuzzMutation = useMutation({
// 		mutationFn: createBuzz,
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["buzzes"] });
// 			toast.success("create buzz success!");
// 			const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
// 			doc_modal.close();
// 		},
// 	});

// 	const handleAddBuzz = (buzz: BuzzNewForm) => {kl
// 		const id = uuidv4();
// 		createBuzzMutation.mutate({
// 			...buzz,
// 			id,
// 			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
// 			user: "vae",
// 			isFollowed: false,
// 			txid: id,
// 		});
// 	};

// 	return (
// 		<LoadingOverlay active={createBuzzMutation.isPending} spinner text="Buzz is Creating...">
// 			<BuzzForm onSubmit={handleAddBuzz} initialValue={{ content: "", createTime: "" }} />{" "}
// 		</LoadingOverlay>
// 	);
// };

// export default AddBuzz;
