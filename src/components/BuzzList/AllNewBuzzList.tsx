import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { buzzEntityAtom } from '../../store/buzz';
import { IBtcEntity } from '@metaid/metaid';
import { environment } from '../../utils/environments';
import { isNil } from 'ramda';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchBuzzs } from '../../api/buzz';
import { Pin } from '../../api/request';
import BuzzCard from './BuzzCard';

type Iprops = {
  address?: string;
  queryKey?: string[];
};

const AllNewBuzzList = ({
  address,
  queryKey = ['buzzes', environment.network],
}: Iprops) => {
  const [total, setTotal] = useState<null | number>(null);

  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const buzzEntity = useAtomValue(buzzEntityAtom);

  const getTotal = async (buzzEntity: IBtcEntity) => {
    setTotal(await buzzEntity?.total({ network: environment.network }));
  };

  useEffect(() => {
    if (!isNil(buzzEntity)) {
      getTotal(buzzEntity!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buzzEntity]);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey,
      enabled: !isNil(buzzEntity),

      queryFn: ({ pageParam }) =>
        fetchBuzzs({
          page: pageParam,
          limit: 5,
          buzzEntity: buzzEntity!,
          network: environment.network,
          address,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages.length + 1 : undefined;
        if (allPages.length * 5 >= (total ?? 0)) {
          return;
        }
        return nextPage;
      },
    });

  const buzzes = data?.pages.map((pins: Pin[] | null) =>
    (pins ?? []).map((pin) => {
      return (
        <BuzzCard
          key={pin.id}
          buzzItem={pin}
          onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
        />
      );
    })
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      {' '}
      {isLoading ? (
        <div className='flex items-center gap-2 justify-center h-[200px]'>
          <div>Buzz Feed is Coming</div>
          <span className='loading loading-bars loading-md grid text-white'></span>
        </div>
      ) : (
        <div className='flex flex-col gap-3 my-4'>
          {buzzes}
          <button
            ref={ref}
            className='btn'
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {hasNextPage && isFetchingNextPage ? (
              <div className='flex items-center gap-1'>
                <div>Loading </div>
                <span className='loading loading-dots loading-md grid text-white'></span>
              </div>
            ) : (
              //:
              // hasNextPage ? (
              // 	<div className="bg-[black]  grid w-full place-items-center">
              // 		Load More
              // 	</div>
              // )
              <div className=' place-items-center'>No more results</div>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default AllNewBuzzList;
