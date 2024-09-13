/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentData } from './CommentForm'
import { toast } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay-ts'
import { useAtomValue } from 'jotai'
import { isNil } from 'ramda'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { connectedNetworkAtom, globalFeeRateAtom } from '../../store/user'
import { SubmitHandler, useForm } from 'react-hook-form'
import { environment } from '../../utils/environments'
import CommentForm from './CommentForm'
import { Pin } from '../../api/request'
import { Connector } from '../../types'
import { IBtcConnector, IMvcConnector } from '@metaid/metaid'
import commentEntitySchema from '../../entities/comment'

type Iprops = {
  connector: Connector
  commentPin: Pin
  isReply?: boolean
}

const CommentFormWrap = ({ connector, commentPin, isReply }: Iprops) => {
  const [isAdding, setIsAdding] = useState(false)
  const connectedNetwork = useAtomValue(connectedNetworkAtom)

  const globalFeerate = useAtomValue(globalFeeRateAtom)
  const queryClient = useQueryClient()
  const commentFormHandle = useForm<CommentData>()

  const onCreateSubmit: SubmitHandler<CommentData> = async (data) => {
    await handleAddComment({
      content: data.content,
    })
  }

  const handleAddComment = async (comment: { content: string }) => {
    setIsAdding(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalBody: any = {
        content: comment.content,
        contentType: 'text/plain',
        commentTo: commentPin.id,
      }

      console.log('finalBody', finalBody)

      if (connectedNetwork === 'btc') {
        const btcConnector = connector as IBtcConnector
        const createRes = await btcConnector.inscribe({
          inscribeDataArray: [
            {
              operation: 'create',
              path: '/protocols/paycomment',
              body: JSON.stringify(finalBody),
              contentType: 'text/plain;utf-8',
              flag: environment.flag,
            },
          ],
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeerate),
            service: {
              address: environment.service_address,
              satoshis: environment.service_satoshi,
            },
            // network: environment.network,
          },
        })

        console.log('create res for inscribe', createRes)
        if (!isNil(createRes?.revealTxIds[0])) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          toast.success('comment successfully')
          commentFormHandle.reset()

          const doc_modal = document.getElementById(
            'comment_buzz_modal_' + commentPin.id,
          ) as HTMLDialogElement
          doc_modal.close()
        }
      } else if (connectedNetwork === 'mvc') {
        const mvcConnector = connector as IMvcConnector
        const Comment = await mvcConnector.load(commentEntitySchema)

        const createRes = await Comment.create({
          data: { body: JSON.stringify(finalBody) },
          options: {
            network: environment.network,
            signMessage: 'create comment',
          },
        })
        console.log('create res for inscribe', createRes)

        if (!isNil(createRes?.txid)) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          toast.success('comment successfully')
          commentFormHandle.reset()

          const doc_modal = document.getElementById(
            'comment_buzz_modal_' + commentPin.id,
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

  return (
    <LoadingOverlay
      active={isAdding}
      spinner
      text={isReply ? 'Replying..' : 'Commenting...'}
    >
      <CommentForm
        onCreateSubmit={onCreateSubmit}
        commentFormHandle={commentFormHandle}
        isReply={isReply}
      />
    </LoadingOverlay>
  )
}

export default CommentFormWrap
