/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem, BuzzData } from './BuzzForm';
// import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
// import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { isEmpty, isNil } from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { globalFeeRateAtom, networkAtom } from '../../store/user';
import { sleep } from '../../utils/time';
import { SubmitHandler, useForm } from 'react-hook-form';
import { image2Attach, removeFileFromList } from '../../utils/file';
import useImagesPreview from '../../hooks/useImagesPreview';
import { fetchFeeRate } from '../../api/buzz';
import { CreateOptions, IBtcConnector, IBtcEntity } from '@metaid/metaid';

type Iprops = {
  btcConnector: IBtcConnector;
};

const BuzzFormWrap = ({ btcConnector }: Iprops) => {
  const [isAdding, setIsAdding] = useState(false);

  const globalFeerate = useAtomValue(globalFeeRateAtom);
  const queryClient = useQueryClient();
  const network = useAtomValue(networkAtom);
  const buzzFormHandle = useForm<BuzzData>();
  const files = buzzFormHandle.watch('images');

  const [filesPreview, setFilesPreview] = useImagesPreview(files);

  const { data: feeRateData } = useQuery({
    queryKey: ['feeRate', network],
    queryFn: () => fetchFeeRate({ netWork: network }),
  });

  const onClearImageUploads = () => {
    setFilesPreview([]);
    buzzFormHandle.setValue('images', [] as any);
  };

  const onCreateSubmit: SubmitHandler<BuzzData> = async (data) => {
    console.log('submit image', data.images);
    const images =
      data.images.length !== 0 ? await image2Attach(data.images) : [];

    await handleAddBuzz({
      content: data.content,
      images,
    });
  };

  const handleAddBuzz = async (buzz: {
    content: string;
    images: AttachmentItem[];
  }) => {
    setIsAdding(true);
    const buzzEntity: IBtcEntity = await btcConnector.use('buzz');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalBody: any = {
        content: buzz.content,
        contentType: 'text/plain',
      };
      if (!isEmpty(buzz.images)) {
        const fileOptions: CreateOptions[] = [];

        const fileEntity = await btcConnector!.use('file');

        for (const image of buzz.images) {
          fileOptions.push({
            body: Buffer.from(image.data, 'hex').toString('base64'),
            contentType: 'image/jpeg;binary',
            encoding: 'base64',
            flag: network === 'mainnet' ? 'metaid' : 'testid',
          });
        }
        const imageRes = await fileEntity.create({
          options: fileOptions,
          noBroadcast: 'no',
          feeRate: selectFeeRate?.number,
          service: {
            address:
              network === 'mainnet'
                ? 'bc1pxn62rxeqzr39qjvq9fnz4t00qjvhepe0jzp44tnljwzaxjvt79dqph7h8m'
                : 'myp2iMt6NeGQxMLt6Hzx1Ho6NbMkiigZ8D',
            satoshis: '1999',
          },
        });

        console.log('imageRes', imageRes);
        finalBody.attachments = imageRes.revealTxIds.map(
          (rid) => 'metafile://' + rid + 'i0'
        );
      }
      await sleep(5000);

      console.log('finalBody', finalBody);

      const createRes = await buzzEntity!.create({
        options: [
          {
            body: JSON.stringify(finalBody),
            contentType: 'text/plain',
            flag: network === 'mainnet' ? 'metaid' : 'testid',
          },
        ],
        noBroadcast: 'no',
        feeRate: selectFeeRate?.number,
        service: {
          address:
            network === 'mainnet'
              ? 'bc1pxn62rxeqzr39qjvq9fnz4t00qjvhepe0jzp44tnljwzaxjvt79dqph7h8m'
              : 'myp2iMt6NeGQxMLt6Hzx1Ho6NbMkiigZ8D',
          satoshis: '1999',
        },
      });
      console.log('create res for inscribe', createRes);
      if (!isNil(createRes?.revealTxIds[0])) {
        await sleep(5000);
        queryClient.invalidateQueries({ queryKey: ['buzzes'] });
        toast.success('create buzz successfully');
        buzzFormHandle.reset();
        onClearImageUploads();

        const doc_modal = document.getElementById(
          'new_buzz_modal'
        ) as HTMLDialogElement;
        doc_modal.close();
      }
    } catch (error) {
      console.log('error', error);
      const errorMessage = (error as any)?.message ?? error;
      const toastMessage = errorMessage?.includes(
        'Cannot read properties of undefined'
      )
        ? 'User Canceled'
        : errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(toastMessage, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      setIsAdding(false);
    }
    setIsAdding(false);
  };

  const [customFee, setCustomFee] = useState<string>(globalFeerate);
  useEffect(() => {
    setCustomFee(globalFeerate);
  }, [globalFeerate]);

  const feeRateOptions = useMemo(() => {
    return [
      { name: 'Slow', number: feeRateData?.hourFee ?? Number(globalFeerate) },
      {
        name: 'Avg',
        number: feeRateData?.halfHourFee ?? Number(globalFeerate),
      },
      {
        name: 'Fast',
        number: feeRateData?.fastestFee ?? Number(globalFeerate),
      },
      { name: 'Custom', number: Number(customFee) },
    ];
  }, [feeRateData, customFee, globalFeerate]);
  const [selectFeeRate, setSelectFeeRate] = useState<{
    name: string;
    number: number;
  }>({
    name: 'Custom',
    number: Number(customFee),
  });

  // console.log('select feerate', selectFeeRate);
  // console.log('feerate data', feeRateData);
  const handleRemoveImage = (index: number) => {
    setFilesPreview(filesPreview.filter((_, i) => i !== index));
    buzzFormHandle.setValue(
      'images',
      removeFileFromList(buzzFormHandle.watch('images'), index)
    );
    // remove item from  files object with index
  };

  return (
    <LoadingOverlay active={isAdding} spinner text='Creating Buzz...'>
      <BuzzForm
        onCreateSubmit={onCreateSubmit}
        handleRemoveImage={handleRemoveImage}
        buzzFormHandle={buzzFormHandle}
        onClearImageUploads={onClearImageUploads}
        filesPreview={filesPreview}
        customFee={customFee}
        setSelectFeeRate={setSelectFeeRate}
        selectFeeRate={selectFeeRate}
        handleCustomFeeChange={setCustomFee}
        feeRateOptions={feeRateOptions}
      />
    </LoadingOverlay>
  );
};

export default BuzzFormWrap;

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
