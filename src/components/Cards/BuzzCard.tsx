/* eslint-disable @typescript-eslint/no-explicit-any */
// import FollowButton from "../Buttons/FollowButton";
import { Heart, Link as LucideLink, MessageCircle } from 'lucide-react'
import { Send } from 'lucide-react'
import { isEmpty, isNil } from 'ramda'
import cls from 'classnames'
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  connectedAtom,
  connectedNetworkAtom,
  connectorAtom,
  globalFeeRateAtom,
  myFollowingListAtom,
  userInfoAtom,
} from '../../store/user'
import { useAtom, useAtomValue } from 'jotai'
import CustomAvatar from '../Public/CustomAvatar'
// import { sleep } from '../../utils/time';
import { toast } from 'react-toastify'
import {
  fetchCurrentBuzzComments,
  fetchCurrentBuzzLikes,
  fetchFollowDetailPin,
  fetchFollowingList,
  getPinDetailByPid,
} from '../../api/buzz'
import {
  checkMetaletConnected,
  checkMetaletInstalled,
  checkUserNameExisted,
} from '../../utils/wallet'
import { environment, getServiceAddress } from '../../utils/environments'
import FollowButton from '../Buttons/FollowButton'
import { Pin } from '../../api/request'
import { useNavigate } from 'react-router-dom'
import ProfileCard from './ProfileCard'
import ForwardBuzzCard from './ForwardBuzzCard'
import { fetchTranlateResult, ResultArray } from '../../api/baidu-translate'
import { useState } from 'react'
import dayjs from '../../utils/dayjsConfig'
import CommentModal from '../Modals/CommentModal'
import RepostModal from '../Modals/RepostModal'
import { toBrowser } from '../../utils/link'
import classNames from 'classnames'
import {
  IBtcConnector,
  IBtcEntity,
  IMvcConnector,
  IMvcEntity,
} from '@metaid/metaid'
import followEntitySchema from '../../entities/follow'
import { getUser } from '../../api/get-user'

type IProps = {
  buzzItem: Pin | undefined
  onBuzzDetail?: (txid: string) => void
  innerRef?: React.Ref<HTMLDivElement>
  showFollowButton?: boolean
}

const BuzzCard = ({
  buzzItem,
  onBuzzDetail,
  innerRef,
  showFollowButton = true,
}: IProps) => {
  const [showTranslateResult, setShowTranslateResult] = useState(false)
  const [translateResult, setTranslateResult] = useState<ResultArray>([])
  const [myFollowingList, setMyFollowingList] = useAtom(myFollowingListAtom)
  const connected = useAtomValue(connectedAtom)
  const connectedNetwork = useAtomValue(connectedNetworkAtom)
  const connector = useAtomValue(connectorAtom)
  const globalFeeRate = useAtomValue(globalFeeRateAtom)
  const userInfo = useAtomValue(userInfoAtom)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  let summary = buzzItem!.contentSummary
  const isSummaryJson = summary.startsWith('{') && summary.endsWith('}')
  // console.log("isjson", isSummaryJson);
  // console.log("summary", summary);
  const parseSummary = isSummaryJson ? JSON.parse(summary) : {}

  summary = isSummaryJson ? parseSummary.content : summary

  const translateMutate = useMutation({
    mutationKey: ['transDetail', buzzItem?.id],
    mutationFn: (summary: string) =>
      fetchTranlateResult({ sourceText: summary }),
  })

  const attachPids =
    isSummaryJson && !isEmpty(parseSummary?.attachments ?? [])
      ? (parseSummary?.attachments ?? []).map(
          (d: string) => d.split('metafile://')[1],
        )
      : []

  const quotePinId =
    isSummaryJson && !isEmpty(parseSummary?.quotePin ?? '')
      ? parseSummary.quotePin
      : ''
  const { isLoading: isQuoteLoading, data: quoteDetailData } = useQuery({
    enabled: !isEmpty(quotePinId),
    queryKey: ['buzzDetail', quotePinId],
    queryFn: () => getPinDetailByPid({ pid: quotePinId }),
  })

  // const attachPids = ["6950f69d7cb83a612fc773d95500a137888f157f1d377cc69c2dd703eebd84eei0"];
  // console.log("current address", buzzItem!.address);

  const { data: currentLikeData } = useQuery({
    queryKey: ['payLike', buzzItem!.id, environment.network],
    queryFn: () =>
      fetchCurrentBuzzLikes({
        pinId: buzzItem!.id,
      }),
  })

  const commentData = useQuery({
    enabled: !isNil(buzzItem?.id),
    queryKey: ['comment-detail', buzzItem!.id],
    queryFn: () => fetchCurrentBuzzComments({ pinId: buzzItem!.id }),
  })

  const isLikeByCurrentUser = (currentLikeData ?? [])?.find(
    (d) => d?.pinAddress === connector?.address,
  )

  const currentUserInfoData = useQuery({
    queryKey: ['userInfo', buzzItem!.address, environment.network],
    queryFn: () => getUser(connector!, buzzItem?.address),
    enabled: !!buzzItem?.address,
  })
  const metaid = currentUserInfoData?.data?.metaid

  const attachData = useQueries({
    queries: attachPids.map((id: string) => {
      return {
        queryKey: ['post', id],
        queryFn: () => getPinDetailByPid({ pid: id }),
      }
    }),
    combine: (results: any) => {
      return {
        data: results.map((result: any) => result.data),
        pending: results.some((result: any) => result.isPending),
      }
    },
  })

  const { data: myFollowingListData } = useQuery({
    queryKey: ['myFollowing', connector?.metaid],
    enabled: !isEmpty(connector?.metaid ?? ''),
    queryFn: () =>
      fetchFollowingList({
        metaid: connector?.metaid ?? '',
        params: { cursor: '0', size: '100', followDetail: false },
      }),
  })

  const { data: followDetailData } = useQuery({
    queryKey: ['followDetail', connector?.metaid, metaid],
    enabled: !isEmpty(connector?.metaid ?? '') && !isEmpty(metaid),
    queryFn: () =>
      fetchFollowDetailPin({
        metaId: metaid ?? '',
        followerMetaId: connector?.metaid ?? '',
      }),
  })

  const renderImages = (pinIds: string[]) => {
    if (pinIds.length === 1) {
      return (
        <>
          <img
            onClick={() => {
              handleImagePreview(pinIds[0])
            }}
            className='image h-[60%] w-[60%] !rounded-md'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            src={`${environment.base_man_url}/content/${pinIds[0]}`}
            alt=''
            key={pinIds[0]}
          />
          <dialog id={`preview_modal_${pinIds[0]}`} className='modal  !z-20'>
            <div className='modal-box bg-[#191C20] !z-20 py-5  w-[90%] lg:w-[50%]'>
              <form method='dialog'>
                {/* if there is a button in form, it will close the modal */}
                <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
                  ✕
                </button>
              </form>
              <h3 className='font-medium text-white text-[16px] text-center'>
                Image Preview
              </h3>

              <img
                className='image w-auto mt-6 !rounded-md'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%',
                }}
                src={`${environment.base_man_url}/content/${pinIds[0]}`}
                alt=''
              />
            </div>
            <form method='dialog' className='modal-backdrop'>
              <button>close</button>
            </form>
          </dialog>
        </>
      )
    }
    return (
      <>
        <div className='grid grid-cols-3 gap-2 place-items-center'>
          {pinIds.map((pinId) => {
            return (
              <div key={pinId}>
                <img
                  className='image !rounded-md self-center'
                  onClick={() => {
                    handleImagePreview(pinId)
                  }}
                  style={{
                    objectFit: 'cover',
                    // objectPosition: 'center',

                    width: '250px',
                    height: '250px',
                  }}
                  src={`${environment.base_man_url}/content/${pinId}`}
                  alt=''
                  key={pinId}
                />
                <dialog id={`preview_modal_${pinId}`} className='modal  !z-20'>
                  <div className='modal-box bg-[#191C20] !z-20 py-5 w-[90%] lg:w-[50%]'>
                    <form method='dialog'>
                      {/* if there is a button in form, it will close the modal */}
                      <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
                        ✕
                      </button>
                    </form>
                    <h3 className='font-medium text-white text-[16px] text-center'>
                      Image Preview
                    </h3>
                    <img
                      className='image h-[48px] w-auto mt-6 !rounded-md'
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        width: '100%',
                        height: '100%',
                      }}
                      src={`${environment.base_man_url}/content/${pinId}`}
                      alt=''
                    />
                  </div>
                  <form method='dialog' className='modal-backdrop'>
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const handleImagePreview = (pinId: string) => {
    const preview_modal = document.getElementById(
      `preview_modal_${pinId}`,
    ) as HTMLDialogElement
    preview_modal.showModal()
  }

  const detectUrl = (summary: string) => {
    const urlReg = /(https?:\/\/[^\s]+)/g

    const urls = summary.match(urlReg)

    if (urls) {
      urls.forEach(function (url) {
        // const replacement = (
        //   <div
        //     dangerouslySetInnerHTML={{
        //       __html: `<a href="${url}" style="text-decoration: underline;">${url}</a>`,
        //     }}
        //   />
        // );
        summary = summary.replace(
          url,
          `<a href="${url}" target="_blank" style="text-decoration: underline;">${url}</a>`,
        )
      })
    }

    return summary
  }

  const handleSpecial = (summary: string) => {
    summary = summary
      .replace('<metaid_flag>', 'metaid_flag')
      .replace('<operation>', 'operation')
      .replace('<path>', 'path')
      .replace('<encryption>', 'encryption')
      .replace('<version>', 'version')
      .replace('<content-type>', 'content-type')
      .replace('<payload>', 'payload')
    return summary
  }

  const renderTranslteResults = (results: ResultArray) => {
    return (
      <div className='flex flex-col gap-2.5'>
        {results.map((result, index) => (
          <span key={index} className='break-all'>
            <div>{result.dst.replace('<br>', '')}</div>

            {/* <br /> */}
          </span>
        ))}
      </div>
    )
  }

  const renderBasicSummary = (summary: string) => {
    return (
      <div className='flex flex-col gap-2.5'>
        {(summary ?? '').split('\n').map((line, index) => (
          <span key={index} className='break-all'>
            <div
              dangerouslySetInnerHTML={{
                __html: handleSpecial(detectUrl(line)),
              }}
            />
          </span>
        ))}
      </div>
    )
  }

  const renderSummary = (summary: string, showDetail: boolean) => {
    return (
      <>
        {showDetail ? (
          <>
            {summary.length < 800 ? (
              renderBasicSummary(summary)
            ) : (
              <div className='flex flex-col gap-0'>
                {renderBasicSummary(summary.slice(0, 800) + '...')}
                <span className=' text-main'>{' more >>'}</span>
              </div>
            )}
          </>
        ) : (
          renderBasicSummary(summary)
        )}
      </>
    )
  }

  const handleLike = async (pinId: string) => {
    await checkMetaletInstalled()
    await checkMetaletConnected(connected)

    if (isLikeByCurrentUser) {
      toast.error('You have already liked that buzz...', {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      })
      return
    }

    try {
      if (connectedNetwork === 'btc') {
        const likeEntity = (await connector!.use('like')) as IBtcEntity
        console.log('likeEntity', likeEntity)
        const likeRes = await likeEntity.create({
          dataArray: [
            {
              body: JSON.stringify({
                isLike: '1',
                likeTo: pinId,
              }),
              flag: environment.flag,
              contentType: 'text/plain;utf-8',
            },
          ],
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeeRate),
            service: {
              address: getServiceAddress(),
              satoshis: environment.service_satoshi,
            },
            // network: environment.network,
          },
        })
        console.log('likeRes', likeRes)
        if (!isNil(likeRes?.revealTxIds[0])) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          queryClient.invalidateQueries({
            queryKey: ['payLike', buzzItem!.id],
          })
          // await sleep(5000);
          toast.success('like buzz successfully')
        }
      } else if (connectedNetwork === 'mvc') {
        const likeEntity = (await connector!.use('like')) as IMvcEntity
        const likeRes = await likeEntity.create({
          data: {
            body: JSON.stringify({
              isLike: '1',
              likeTo: pinId,
            }),
          },
          options: {
            network: environment.network,
            signMessage: 'like buzz',
          },
        })
        console.log('likeRes', likeRes)
        if (!isNil(likeRes?.txid)) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] })
          queryClient.invalidateQueries({
            queryKey: ['payLike', buzzItem!.id],
          })
          // await sleep(5000);
          toast.success('like buzz successfully')
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
    }
  }

  const handleFollow = async () => {
    await checkMetaletInstalled()
    await checkMetaletConnected(connected)

    // const doc_modal = document.getElementById(
    //   'confirm_follow_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();

    if (
      !isNil(followDetailData) &&
      (myFollowingListData?.list ?? []).includes(metaid)
    ) {
      try {
        if (connectedNetwork === 'btc') {
          const btcConnector = connector as IBtcConnector
          const unfollowRes = await btcConnector!.inscribe({
            inscribeDataArray: [
              {
                operation: 'revoke',
                path: `@${followDetailData.followPinId}`,
                contentType: 'text/plain;utf-8',
                flag: environment.flag,
              },
            ],
            options: {
              noBroadcast: 'no',
              feeRate: Number(globalFeeRate),
              service: {
                address: getServiceAddress(),
                satoshis: environment.service_satoshi,
              },
              // network: environment.network,
            },
          })
          if (!isNil(unfollowRes?.revealTxIds[0])) {
            queryClient.invalidateQueries({
              queryKey: ['buzzes'],
            })
            setMyFollowingList((d) => {
              return d.filter((i) => i !== currentUserInfoData?.data?.metaid)
            })
            // await sleep(5000);
            toast.success(
              'Unfollow successful! Please wait for the transaction to be confirmed.',
            )
          }
        } else if (connectedNetwork === 'mvc') {
          const mvcConnector = connector as IMvcConnector
          const Follow = await mvcConnector.load(followEntitySchema)

          const res = await Follow.create({
            data: {
              // @ts-ignore
              path: `@${followDetailData.followPinId}`,
              contentType: 'text/plain;utf-8',
              operation: 'revoke',
            },
            options: {
              network: environment.network,
              signMessage: 'Unfollow user',
            },
          })

          if (!isNil(res?.txid)) {
            queryClient.invalidateQueries({ queryKey: ['buzzes'] })
            setMyFollowingList((d) => {
              return d.filter((i) => i !== currentUserInfoData?.data?.metaid)
            })

            toast.success(
              'Unfollow successful! Please wait for the transaction to be confirmed.',
            )
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
      }
    } else {
      try {
        if (connectedNetwork === 'btc') {
          const btcConnector = connector as IBtcConnector
          const followRes = await btcConnector!.inscribe({
            inscribeDataArray: [
              {
                operation: 'create',
                path: '/follow',
                body: currentUserInfoData?.data?.metaid,
                contentType: 'text/plain;utf-8',

                flag: environment.flag,
              },
            ],
            options: {
              noBroadcast: 'no',
              feeRate: Number(globalFeeRate),
              service: {
                address: getServiceAddress(),
                satoshis: environment.service_satoshi,
              },
              // network: environment.network,
            },
          })
          if (!isNil(followRes?.revealTxIds[0])) {
            queryClient.invalidateQueries({ queryKey: ['buzzes'] })
            setMyFollowingList((d: string[]) => {
              return [...d, currentUserInfoData!.data!.metaid]
            })

            toast.success(
              'Follow successfully! Please wait for the transaction to be confirmed!',
            )
          }
        } else if (connectedNetwork === 'mvc') {
          const mvcConnector = connector as IMvcConnector
          const Follow = await mvcConnector.load(followEntitySchema)

          const res = await Follow.create({
            data: { body: currentUserInfoData?.data?.metaid },
            options: {
              network: environment.network,
              signMessage: 'Follow user',
            },
          })
          console.log('create res for inscribe', res)

          if (!isNil(res?.txid)) {
            queryClient.invalidateQueries({ queryKey: ['buzzes'] })
            setMyFollowingList((d: string[]) => {
              return [...d, currentUserInfoData!.data!.metaid]
            })

            toast.success(
              'Follow successfully! Please wait for the transaction to be confirmed!',
            )
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
      }
    }
  }

  const onProfileDetail = (address: string) => {
    navigate(`/profile/${address}`)
  }

  // console.log(
  //   currentUserInfoData.data?.name,
  //   !(myFollowingList ?? []).includes(metaid ?? '') &&
  //     (myFollowingListData?.list ?? []).includes(metaid),
  //   'isUnfollowpending'
  // );

  const handleTranslate = async () => {
    if (isEmpty(translateResult)) {
      const res = await translateMutate.mutateAsync(summary)
      setTranslateResult(res?.trans_result ?? [])
    }
    setShowTranslateResult(!showTranslateResult)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (isNil(buzzItem)) {
    return <div>can't fetch this buzz</div>
  }

  return (
    <>
      <div
        className={cls(
          'w-full border border-white rounded-xl flex flex-col gap-4',
        )}
        ref={innerRef}
      >
        <div className='flex items-center justify-between pt-4 px-4'>
          <div className='dropdown dropdown-hover dropdown-right'>
            <div
              tabIndex={0}
              role='button'
              className='flex gap-2 items-center cursor-pointer'
            >
              {isNil(currentUserInfoData.data) ? (
                <div className='avatar placeholder'>
                  <div className='bg-[#2B3440] text-[#D7DDE4] rounded-full w-12'>
                    <span>{buzzItem!.metaid.slice(0, 6)}</span>
                  </div>
                </div>
              ) : (
                <CustomAvatar
                  userInfo={currentUserInfoData.data}
                  onProfileDetail={onProfileDetail}
                />
              )}
              <div className='flex flex-col md:text-md text-sm'>
                <div className='text-slate-200'>
                  {isNil(currentUserInfoData?.data?.name) ||
                  isEmpty(currentUserInfoData?.data?.name)
                    ? 'metaid-user-' + buzzItem.address.slice(0, 6)
                    : currentUserInfoData?.data?.name}
                </div>
                <div className='text-gray text-xs'>
                  {(metaid ?? '').slice(0, 6)}
                </div>
              </div>
            </div>

            <div tabIndex={0} className='dropdown-content'>
              <ProfileCard address={buzzItem.address} isDropdown />
            </div>
          </div>

          {connector?.metaid !== metaid && showFollowButton && (
            <FollowButton
              isFollowed={(myFollowingListData?.list ?? []).includes(metaid)}
              isFollowingPending={
                (myFollowingList ?? []).includes(metaid ?? '') &&
                !(myFollowingListData?.list ?? []).includes(metaid)
              }
              isUnfollowingPending={
                !(myFollowingList ?? []).includes(metaid ?? '') &&
                (myFollowingListData?.list ?? []).includes(metaid)
              }
              handleFollow={handleFollow}
            />
          )}
        </div>
        <div
          className={cls('border-y  border-white p-4', {
            'cursor-pointer': !isNil(onBuzzDetail),
          })}
        >
          <div
            className='flex flex-col gap-2'
            onClick={() => onBuzzDetail && onBuzzDetail(buzzItem.id)}
          >
            {showTranslateResult
              ? renderTranslteResults(translateResult)
              : renderSummary(summary, !isNil(onBuzzDetail))}
            <div className='text-main mb-4 cursor-pointer'>
              {translateMutate.isPending ? (
                <div className='loading loading-dots'></div>
              ) : (
                <div
                  onClick={async (e) => {
                    e.stopPropagation()
                    handleTranslate()
                  }}
                >
                  {showTranslateResult ? 'show original content' : 'translate'}
                </div>
              )}
            </div>
          </div>
          <div>
            {!attachData.pending &&
              !isEmpty(
                (attachData?.data ?? []).filter((d: any) => !isNil(d)),
              ) &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderImages(attachPids)}
          </div>
          {!isEmpty(quotePinId) && (
            <div className='mb-8 mt-4'>
              {isQuoteLoading ? (
                <div className='flex items-center gap-2 justify-center text-gray h-[150px]'>
                  <div>Loading repost content...</div>
                  <span className='loading loading-bars loading-md grid '></span>
                </div>
              ) : (
                <ForwardBuzzCard buzzItem={quoteDetailData} />
              )}
            </div>
          )}

          <div className='flex justify-between text-gray mt-2'>
            <div
              className='flex gap-2 items-center hover:text-slate-300 md:text-md text-xs'
              onClick={() =>
                toBrowser(buzzItem.genesisTransaction, buzzItem?.chainName)
              }
            >
              <LucideLink size={12} />
              <div>{buzzItem.genesisTransaction.slice(0, 8) + '...'}</div>

              {!!buzzItem.chainName && (
                <span
                  className={classNames(
                    'text-sm px-2 py-px rounded uppercase',
                    buzzItem.chainName === 'mvc'
                      ? 'bg-sky-950 text-sky-400'
                      : 'bg-main/10 text-main',
                  )}
                >
                  {buzzItem.chainName}
                </span>
              )}
            </div>

            <div className='flex gap-2 md:text-md text-xs items-center'>
              {buzzItem?.number === -1 && (
                <div
                  className='tooltip tooltip-secondary mt-0.5'
                  data-tip='This buzz(PIN) is still in the mempool...'
                >
                  <span className='loading loading-ring loading-sm cursor-pointer'></span>
                </div>
              )}

              <div>
                {dayjs
                  .unix(buzzItem.timestamp)
                  .tz(dayjs.tz.guess())
                  .format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between pb-4 px-4'>
          <div className='flex gap-3 items-center'>
            <div className='flex gap-1 items-center'>
              <Heart
                className={cls(
                  { 'text-[red]': isLikeByCurrentUser },
                  'cursor-pointer',
                )}
                fill={isLikeByCurrentUser && 'red'}
                onClick={() => handleLike(buzzItem!.id)}
              />
              {!isNil(currentLikeData) ? currentLikeData.length : null}
            </div>
            <div className='flex gap-1 items-center cursor-pointer'>
              <Send
                onClick={async () => {
                  await checkMetaletInstalled()
                  await checkMetaletConnected(connected)
                  await checkUserNameExisted(userInfo?.name ?? '')
                  ;(document.getElementById(
                    'repost_buzz_modal_' + buzzItem.id,
                  ) as HTMLDialogElement)!.showModal()
                }}
              />
            </div>
            <div className='flex gap-1 items-center cursor-pointer'>
              <MessageCircle
                onClick={async () => {
                  await checkMetaletInstalled()
                  await checkMetaletConnected(connected)
                  await checkUserNameExisted(userInfo?.name ?? '')
                  ;(document.getElementById(
                    'comment_buzz_modal_' + buzzItem.id,
                  ) as HTMLDialogElement)!.showModal()
                }}
              />
              {!isNil(commentData?.data) ? commentData?.data.length : null}
            </div>
          </div>
          <div className='btn btn-sm rounded-full hidden'>Want To Buy</div>
        </div>
      </div>

      <RepostModal quotePin={buzzItem} connector={connector!} />

      <CommentModal
        commentPin={buzzItem}
        commentToUser={currentUserInfoData?.data}
        connector={connector!}
      />
    </>
  )
}

export default BuzzCard
