import { RotateCw, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
// import { useState } from "react";
// import cls from "classnames";
import BuzzCard from "./BuzzCard";
import { fetchBuzzs } from "../../api/buzz";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useAtomValue, useSetAtom } from "jotai";
import { buzzEntityAtom } from "../../store/buzz";
import { isNil } from "ramda";
import { BtcEntity } from "@metaid/metaid/dist/core/entity/btc";
import { userInfoAtom, walletAtom } from "../../store/user";
import { btcConnect } from "@metaid/metaid";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
// import { useCallback } from 'react';
// // import { BuzzItem } from '../../types';
// import { useAtom } from 'jotai';
// import { btcConnectorAtom } from '../../store/user';
// import { buzzPinsAtom } from '../../store/buzz';
// import { isNil } from 'ramda';

export type Pin = {
	id: string;
	number: number;
	rootTxId: string;
	address: string;
	output: string;
	outputValue: number;
	timestamp: number;
	genesisFee: number;
	genesisHeight: number;
	genesisTransaction: string;
	txInIndex: number;
	txInOffset: number;
	operation: string;
	path: string;
	parentPath: string;
	encryption: string;
	version: string;
	contentType: string;
	contentBody: string;
	contentLength: number;
	contentSummary: string;
};

const BuzzList = () => {
	const [total, setTotal] = useState<null | number>(null);
	const setUserInfo = useSetAtom(userInfoAtom);
	const _wallet = useAtomValue(walletAtom);
	const navigate = useNavigate();
	const { ref, inView } = useInView();

	const buzzEntity = useAtomValue(buzzEntityAtom);
	// console.log("buzzEntity", !isNil(buzzEntity), buzzEntity);
	// const [showNewBuzz, setShowNewBuzz] = useState(true);

	const getTotal = async (buzzEntity: BtcEntity) => {
		setTotal(await buzzEntity?.calcPins());
	};

	useEffect(() => {
		if (!isNil(buzzEntity)) {
			getTotal(buzzEntity!);
		}
	}, [buzzEntity]);

	const {
		data,
		isLoading,
		// isFetching,
		isRefetching,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["buzzes"],
		enabled: !isNil(buzzEntity),

		queryFn: ({ pageParam }) =>
			fetchBuzzs({ page: pageParam, limit: 5, buzzEntity: buzzEntity! }),
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
			// console.log("Fire!");
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	const handleRefresh = async () => {
		refetch();
		// const _wallet = await MetaletWalletForBtc.create();
		const _btcConnector: BtcConnector = await btcConnect(_wallet ?? undefined);
		const _user = await _btcConnector.getUser();

		setUserInfo(_user);
	};

	return (
		<div>
			<div className="flex gap-2 items-center place-content-center mt-0  ">
				<Sparkle className="text-main" />

				<div className="text-white text-[36px] font-['Impact']">{"What's New Today"}</div>
				{!isRefetching ? (
					<RotateCw
						className="text-gray absolute right-0 cursor-pointer"
						onClick={handleRefresh}
					/>
				) : (
					<div className="loading loading-dots absolute right-0 text-gray text-sm "></div>
				)}

				<Sparkle className="text-main" />
			</div>

			{/* <div className="text-white flex mx-auto border border-white w-fit rounded-full mt-8">
				<div
					className={cls("btn w-[150px] h-[26px] cursor-pointer", {
						"btn-primary rounded-full": !showNewBuzz,
						"btn-outline border-none": showNewBuzz,
					})}
					onClick={() => setShowNewBuzz(false)}
				>
					Follow
				</div>
				<div
					className={cls("btn w-[150px] h-[26px] cursor-pointer", {
						"btn-primary rounded-full": showNewBuzz,
						"btn-outline border-none": !showNewBuzz,
					})}
					onClick={() => setShowNewBuzz(true)}
				>
					New
				</div>
			</div> */}

			{isLoading ? (
				<div className="flex items-center gap-2 justify-center h-[200px]">
					<div>Buzz Feed is Coming</div>
					<span className="loading loading-bars loading-md grid text-white"></span>
				</div>
			) : (
				<div className="flex flex-col gap-3 my-4">
					{buzzes}
					<button
						ref={ref}
						className="btn"
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						{hasNextPage && isFetchingNextPage ? (
							<div className="flex items-center gap-1">
								<div>Loading </div>
								<span className="loading loading-dots loading-md grid text-white"></span>
							</div>
						) : (
							//:
							// hasNextPage ? (
							// 	<div className="bg-[black]  grid w-full place-items-center">
							// 		Load More
							// 	</div>
							// )
							<div className=" place-items-center">Nothing more to load </div>
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default BuzzList;
