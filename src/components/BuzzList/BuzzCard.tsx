/* eslint-disable @typescript-eslint/no-explicit-any */
// import FollowButton from "../Buttons/FollowButton";
import { Heart, Link as LucideLink } from 'lucide-react';
// import { MessageCircle, Send, } from "lucide-react";
import { isEmpty, isNil } from 'ramda';
import cls from 'classnames';
import dayjs from 'dayjs';
import { Pin } from '.';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  btcConnectorAtom,
  connectedAtom,
  globalFeeRateAtom,
} from '../../store/user';
import { useAtomValue } from 'jotai';
import CustomAvatar from '../CustomAvatar';
// import { sleep } from '../../utils/time';
import { toast } from 'react-toastify';
import { fetchCurrentBuzzLikes, getPinDetailByPid } from '../../api/buzz';
import {
  checkMetaletConnected,
  checkMetaletInstalled,
} from '../../utils/wallet';
import { environment } from '../../utils/environments';

type IProps = {
  buzzItem: Pin | undefined;
  onBuzzDetail?: (txid: string) => void;
  innerRef?: React.Ref<HTMLDivElement>;
};

const BuzzCard = ({ buzzItem, onBuzzDetail, innerRef }: IProps) => {
  const connected = useAtomValue(connectedAtom);
  const btcConnector = useAtomValue(btcConnectorAtom);
  const globalFeeRate = useAtomValue(globalFeeRateAtom);
  const queryClient = useQueryClient();
  // console.log("buzzitem", buzzItem);
  let summary = buzzItem!.contentSummary;
  const isSummaryJson = summary.startsWith('{') && summary.endsWith('}');
  // console.log("isjson", isSummaryJson);
  // console.log("summary", summary);
  const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

  summary = isSummaryJson ? parseSummary.content : summary;

  const attachPids = isSummaryJson
    ? (parseSummary?.attachments ?? []).map(
        (d: string) => d.split('metafile://')[1]
      )
    : [];

  // const attachPids = ["6950f69d7cb83a612fc773d95500a137888f157f1d377cc69c2dd703eebd84eei0"];
  // console.log("current address", buzzItem!.address);

  const { data: currentLikeData } = useQuery({
    queryKey: ['payLike', buzzItem!.id, environment.network],
    queryFn: () =>
      fetchCurrentBuzzLikes({
        pinId: buzzItem!.id,
      }),
  });

  const isLikeByCurrentUser = (currentLikeData ?? [])?.find(
    (d) => d?.pinAddress === btcConnector?.address
  );

  const currentUserInfoData = useQuery({
    queryKey: ['userInfo', buzzItem!.address, environment.network],
    queryFn: () =>
      btcConnector?.getUser({
        network: environment.network,
        currentAddress: buzzItem!.address,
      }),
  });
  const metaid = currentUserInfoData?.data?.metaid ?? btcConnector?.metaid;
  const attachData = useQueries({
    queries: attachPids.map((id: string) => {
      return {
        queryKey: ['post', id],
        queryFn: () => getPinDetailByPid({ pid: id }),
      };
    }),
    combine: (results: any) => {
      return {
        data: results.map((result: any) => result.data),
        pending: results.some((result: any) => result.isPending),
      };
    },
  });

  const handleLike = async (pinId: string) => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);
    // const stillPool = await checkMetaidInitStillPool(userInfo!);

    if (isLikeByCurrentUser) {
      toast.error('You have already liked that buzz...', {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      return;
    }

    const likeEntity = await btcConnector!.use('like');
    try {
      const likeRes = await likeEntity.create({
        options: [
          {
            body: JSON.stringify({ isLike: '1', likeTo: pinId }),
            flag: environment.flag,
            contentType: 'text/plain;utf-8',
          },
        ],
        noBroadcast: 'no',
        feeRate: Number(globalFeeRate),
        service: {
          address: environment.service_address,
          satoshis: environment.service_staoshi,
        },
      });
      console.log('likeRes', likeRes);
      if (!isNil(likeRes?.revealTxIds[0])) {
        queryClient.invalidateQueries({ queryKey: ['buzzes'] });
        queryClient.invalidateQueries({ queryKey: ['payLike', buzzItem!.id] });
        // await sleep(5000);
        toast.success('like buzz successfully');
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
    }
  };

  const renderImages = (pinIds: string[]) => {
    if (pinIds.length === 1) {
      return (
        <>
          <img
            onClick={() => {
              handleImagePreview(pinIds[0]);
            }}
            className='image h-[60%] w-[60%]'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            src={`${environment.base_man_url}/content/${pinIds[0]}`}
            alt=''
            key={pinIds[0]}
          />
          <dialog id={`preview_modal_${pinIds[0]}`} className='modal  !z-20'>
            <div className='modal-box bg-[#191C20] !z-20 py-5 w-[50%]'>
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
                className='image w-auto mt-6'
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
      );
    }
    return (
      <>
        <div className='grid grid-cols-3 gap-2 place-items-center'>
          {pinIds.map((pinId) => {
            return (
              <div key={pinId}>
                <img
                  className='image !h-[180px] w-auto'
                  onClick={() => {
                    handleImagePreview(pinId);
                  }}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                  src={`${environment.base_man_url}/content/${pinId}`}
                  alt=''
                  key={pinId}
                />
                <dialog id={`preview_modal_${pinId}`} className='modal  !z-20'>
                  <div className='modal-box bg-[#191C20] !z-20 py-5 w-[50%]'>
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
                      className='image h-[48px] w-auto mt-6'
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
            );
          })}
        </div>
      </>
    );
  };

  const handleImagePreview = (pinId: string) => {
    const preview_modal = document.getElementById(
      `preview_modal_${pinId}`
    ) as HTMLDialogElement;
    preview_modal.showModal();
  };

  const detectUrl = (summary: string) => {
    const urlReg = /(https?:\/\/[^\s]+)/g;

    const urls = summary.match(urlReg);

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
          `<a href="${url}" target="_blank" style="text-decoration: underline;">${url}</a>`
        );
      });
    }
    return summary;
  };

  const renderBasicSummary = (summary: string) => {
    return (
      <div>
        {(summary ?? '').split('\n').map((line, index) => (
          <span key={index} className='break-all'>
            {/* {line} */}
            <div
              dangerouslySetInnerHTML={{
                __html: detectUrl(line),
              }}
            />
            <br />
          </span>
        ))}
      </div>
    );
  };

  const renderSummary = (summary: string, showDetail: boolean) => {
    return (
      <>
        {showDetail ? (
          <>
            {summary.length < 500 ? (
              renderBasicSummary(summary)
            ) : (
              <div>
                {summary.slice(0, 500)}
                <span className='text-main'>{' more >>'}</span>
              </div>
            )}
          </>
        ) : (
          renderBasicSummary(summary)
        )}
      </>
    );
  };

  if (isNil(buzzItem)) {
    return <div>can't fetch this buzz</div>;
  }

  return (
    <>
      <div
        className='w-full border border-white rounded-xl flex flex-col gap-4'
        ref={innerRef}
      >
        <div className='flex items-center justify-between pt-4 px-4'>
          <div className='flex gap-2 items-center'>
            {isNil(currentUserInfoData.data) ? (
              <div className='avatar placeholder'>
                <div className='bg-[#2B3440] text-[#D7DDE4] rounded-full w-12'>
                  <span>{buzzItem!.address.slice(-4, -2)}</span>
                </div>
              </div>
            ) : (
              <CustomAvatar userInfo={currentUserInfoData.data} />
            )}
            <div className='flex flex-col'>
              <div className='text-gray'>
                {isNil(currentUserInfoData?.data?.name) ||
                isEmpty(currentUserInfoData?.data?.name)
                  ? 'metaid-user-' + buzzItem.address.slice(-4)
                  : currentUserInfoData?.data?.name}
              </div>
              <div className='text-gray text-xs'>
                {(metaid ?? '').slice(0, 6)}
              </div>
            </div>
          </div>
          {/* <FollowButton isFollowed={true} /> */}
        </div>
        <div
          className={cls('border-y border-white p-4', {
            'cursor-pointer': !isNil(onBuzzDetail),
          })}
          // onClick={() => onBuzzDetail && onBuzzDetail(buzzItem.id)}
        >
          <div
            className='flex flex-col gap-2'
            onClick={() => onBuzzDetail && onBuzzDetail(buzzItem.id)}
          >
            {renderSummary(summary, !isNil(onBuzzDetail))}
          </div>
          <div className='mt-4'>
            {!attachData.pending &&
              !isEmpty(
                (attachData?.data ?? []).filter((d: any) => !isNil(d))
              ) &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderImages(attachPids)}
          </div>
          <div className='flex justify-between text-gray mt-2'>
            <div
              className='flex gap-2 items-center hover:text-slate-300'
              onClick={() => {
                window.open(
                  `https://mempool.space/${
                    environment.network === 'mainnet' ? '' : 'testnet/'
                  }tx/${buzzItem.genesisTransaction}`,
                  '_blank'
                );
              }}
            >
              <LucideLink size={12} />
              <div>{buzzItem.genesisTransaction.slice(0, 8) + '...'}</div>
            </div>
            <div>
              {dayjs.unix(buzzItem.timestamp).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between pb-4 px-4'>
          <div className='flex gap-2'>
            <Heart
              className={cls(
                { 'text-[red]': isLikeByCurrentUser },
                'cursor-pointer'
              )}
              fill={isLikeByCurrentUser && 'red'}
              onClick={() => handleLike(buzzItem!.id)}
            />

            {!isNil(currentLikeData) ? currentLikeData.length : null}
            {/* <MessageCircle />
					<Send /> */}
          </div>
          {/* <div className="btn btn-sm rounded-full">Want To Buy</div> */}
        </div>
      </div>
    </>
  );
};

export default BuzzCard;
