/* eslint-disable @typescript-eslint/no-explicit-any */
import FollowButton from "../Buttons/FollowButton";
import { Heart, Link as LucideLink } from "lucide-react";
// import { MessageCircle, Send, } from "lucide-react";
import { isEmpty, isNil } from "ramda";
import cls from "classnames";
import dayjs from "dayjs";
import { Pin } from ".";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPinDetailByPid } from "../../api/pin";
import { btcConnectorAtom } from "../../store/user";
import { useAtomValue } from "jotai";
import CustomAvatar from "../CustomAvatar";
// import { sleep } from '../../utils/time';
import { toast } from "react-toastify";
import { fetchCurrentBuzzLikes } from "../../api/buzz";

type IProps = {
	buzzItem: Pin | undefined;
	onBuzzDetail?: (txid: string) => void;
	innerRef?: React.Ref<HTMLDivElement>;
};

const BuzzCard = ({ buzzItem, onBuzzDetail, innerRef }: IProps) => {
	const btcConnector = useAtomValue(btcConnectorAtom);
	const queryClient = useQueryClient();

	let summary = buzzItem!.contentSummary;
	const isSummaryJson = summary.startsWith("{") && summary.endsWith("}");
	// console.log("isjson", isSummaryJson);
	// console.log("summary", summary);
	const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

	summary = isSummaryJson ? parseSummary.content : summary;

	const attachPids = isSummaryJson
		? parseSummary.attachments.map((d: string) => d.split("metafile://")[1])
		: [];

	// const attachPids = ["6950f69d7cb83a612fc773d95500a137888f157f1d377cc69c2dd703eebd84eei0"];
	// console.log("ata", attachPids);
	// console.log("current address", buzzItem!.address);

	const { data: currentLikeData } = useQuery({
		queryKey: ["payLike", buzzItem!.id],
		queryFn: () => fetchCurrentBuzzLikes(buzzItem!.id),
	});
	const isLikeByCurrentUser = (currentLikeData ?? []).find(
		(d) => d.pinAddress === btcConnector?.address
	);

	const currentUserInfoData = useQuery({
		queryKey: ["userInfo", buzzItem!.address],
		queryFn: () => btcConnector?.getUser(buzzItem!.address),
	});
	// console.log("address", buzzItem!.address);
	// console.log("currentUserInfoData", currentUserInfoData.data?.avatar);
	const attachData = useQueries({
		queries: attachPids.map((id: string) => {
			return {
				queryKey: ["post", id],
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
	// console.log("attachData", attachData);

	const handleLike = async (pinId: string) => {
		if (isLikeByCurrentUser) {
			toast.warn("You have already liked that buzz...");
			return;
		}

		const likeEntity = await btcConnector!.use("like");
		try {
			const likeRes = await likeEntity.create({
				options: [
					{
						body: JSON.stringify({ isLike: "1", likeTo: pinId }),
					},
				],
				noBroadcast: "no",
			});
			console.log("likeRes", likeRes);
			if (!isNil(likeRes?.revealTxIds[0])) {
				queryClient.invalidateQueries({ queryKey: ["buzzes"] });
				queryClient.invalidateQueries({ queryKey: ["payLike", buzzItem!.id] });
				// await sleep(5000);
				toast.success("like buzz successfully");
			}
		} catch (error) {
			console.log("error", error);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.warn((error as any)?.message ?? "too-long-mempool-chain");
		}
	};

	const renderImages = (pinIds: string[]) => {
		return (
			<div className="grid grid-cols-3 gap-2 place-items-center">
				{pinIds.map((pinId) => {
					return (
						<img
							className="image"
							height={"48px"}
							width={"auto"}
							src={`https://man-test.metaid.io/content/${pinId}`}
							alt=""
							key={pinId}
						/>
					);
				})}
			</div>
		);
	};
	if (isNil(buzzItem)) {
		return <div>can't fetch this buzz</div>;
	}

	return (
		<div className="w-full border border-white rounded-xl flex flex-col gap-4" ref={innerRef}>
			<div className="flex items-center justify-between pt-4 px-4">
				<div className="flex gap-2 items-center">
					{/* <img
						src={`https://picsum.photos/seed/${imgSeed}/200`}
						alt="user avatar"
						className="rounded-full"
						width={40}
						height={40}
					/> */}
					{isNil(currentUserInfoData.data) ? (
						<div className="avatar placeholder">
							<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-12">
								<span>{buzzItem!.address.slice(-4, -2)}</span>
							</div>
						</div>
					) : (
						<CustomAvatar userInfo={currentUserInfoData.data} />
					)}

					<div className="text-gray">
						{isNil(currentUserInfoData?.data?.name) ||
						isEmpty(currentUserInfoData?.data?.name)
							? "metaid-user-" + buzzItem.address.slice(-4)
							: currentUserInfoData?.data?.name}
					</div>
				</div>
				<FollowButton isFollowed={true} />
			</div>
			<div
				className={cls("border-y border-white p-4", {
					"cursor-pointer": !isNil(onBuzzDetail),
				})}
				onClick={() => onBuzzDetail && onBuzzDetail(buzzItem.id)}
			>
				<div className="flex flex-col gap-2">
					<div>{summary} </div>
					{!attachData.pending &&
						!isEmpty((attachData?.data ?? []).filter((d: any) => !isNil(d))) &&
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						renderImages(attachPids)}
				</div>
				<div className="flex justify-between text-gray mt-2">
					<div className="flex gap-2 items-center">
						<LucideLink size={12} />
						<div>{buzzItem.rootTxId.slice(0, 8) + "..."}</div>
					</div>
					<div>{dayjs.unix(buzzItem.timestamp).format("YYYY-MM-DD HH:mm:ss")}</div>
				</div>
			</div>

			<div className="flex items-center justify-between pb-4 px-4">
				<div className="flex gap-2">
					<Heart
						className={cls({ "text-[red]": isLikeByCurrentUser }, "cursor-pointer")}
						fill={isLikeByCurrentUser && "red"}
						onClick={() => handleLike(buzzItem!.id)}
					/>

					{!isNil(currentLikeData) ? currentLikeData.length : null}
					{/* <MessageCircle />
					<Send /> */}
				</div>
				<div className="btn btn-sm rounded-full">Want To Buy</div>
			</div>
		</div>
	);
};

export default BuzzCard;
