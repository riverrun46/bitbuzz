import { Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import cls from "classnames";
import BuzzCard from "./BuzzCard";
import { fetchBuzzs } from "../../api/buzz";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { BuzzItem } from "../../types";

const BuzzList = () => {
	const navigate = useNavigate();
	const { ref, inView } = useInView();

	const [showNewBuzz, setShowNewBuzz] = useState(true);
	const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: ["buzzes"],
		queryFn: ({ pageParam }) => fetchBuzzs(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
	});

	const buzzes = data?.pages.map((buzzItems: BuzzItem[]) =>
		buzzItems.map((buzzItem, index) => {
			if (buzzItems.length == index + 1) {
				return (
					<BuzzCard
						// innerRef={ref}
						key={buzzItem.txid}
						buzzItem={buzzItem}
						onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
					/>
				);
			}
			return (
				<BuzzCard
					key={buzzItem.txid}
					buzzItem={buzzItem}
					onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
				/>
			);
		})
	);

	useEffect(() => {
		if (inView && hasNextPage) {
			console.log("Fire!");
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	return (
		<div>
			<div className="flex gap-2 items-center place-content-center mt-16">
				<Sparkle className="text-main" />
				<div className="text-white text-[36px] font-['Impact']">{"What's New Today"}</div>
				<Sparkle className="text-main" />
			</div>

			<div className="text-white flex mx-auto border border-white w-fit rounded-full mt-8">
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
			</div>

			{isLoading ? (
				<div className="flex items-center gap-2 justify-center h-[200px]">
					<div>Buzz Feed is Coming</div>
					<span className="loading loading-bars loading-md grid text-white"></span>
				</div>
			) : (
				<div className="flex flex-col gap-3 my-4">
					{/* {(buzzes ?? []).map((d) => (
						<BuzzCard
							key={d.txid}
							buzzItem={d}
							onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
						/>
					))} */}
					{buzzes}
					<button
						ref={ref}
						className="btn bg-white"
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<div className="flex items-center gap-1">
								<div>Loading more</div>
								<span className="loading loading-dots loading-md grid text-white"></span>
							</div>
						) : hasNextPage ? (
							"Load Newer"
						) : (
							"Nothing more to load"
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default BuzzList;
