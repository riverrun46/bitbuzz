// import { BuzzItem } from "../../types";
import FollowButton from "../Buttons/FollowButton";
import { Heart, MessageCircle, Send, Link as LucideLink } from "lucide-react";
import { flatten, isEmpty, isNil } from "ramda";
import cls from "classnames";
import dayjs from "dayjs";
import { Pin } from ".";
import { useQueries } from "@tanstack/react-query";
import { getPinDetailByPid } from "../../api/pin";

type IProps = {
	buzzItem: Pin | undefined;
	imgSeed: string;
	onBuzzDetail?: (txid: string) => void;
	innerRef?: React.Ref<HTMLDivElement>;
};

const BuzzCard = ({ buzzItem, onBuzzDetail, innerRef, imgSeed }: IProps) => {
	let summary = buzzItem!.contentSummary;
	const isSummaryJson = summary.startsWith("{") && summary.endsWith("}");
	// console.log("isjson", isSummaryJson);
	console.log("summary", summary);
	const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

	summary = isSummaryJson ? parseSummary.content : summary;

	const attachPids = isSummaryJson
		? parseSummary.attachments.map((d: string) => d.split("metafile://")[1])
		: [];

	// const attachPids = ["6950f69d7cb83a612fc773d95500a137888f157f1d377cc69c2dd703eebd84eei0"];
	console.log("ata", attachPids);

	const attachData = useQueries({
		queries: attachPids.map((id: string) => {
			return { queryKey: ["post", id], queryFn: () => getPinDetailByPid({ pid: id }) };
		}),
		combine: (results) => {
			return {
				data: results.map((result) => result.data),
				pending: results.some((result) => result.isPending),
			};
		},
	});
	console.log("comb", attachData);

	const renderImages = (pinNumbers: number[]) => {
		return (
			<div className="grid grid-cols-3 gap-2 place-items-center">
				{pinNumbers.map((number) => {
					return (
						<img
							className="image"
							height={"50px"}
							width={"auto"}
							src={`https://man-test.metaid.io/content/${number}`}
							alt=""
							key={number}
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
					<img
						src={`https://picsum.photos/seed/${imgSeed}/200`}
						alt="user avatar"
						className="rounded-full"
						width={40}
						height={40}
					/>
					<div className="text-gray">
						{"metaid-user-" + buzzItem.address.slice(-4, -1)}
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
						!isEmpty((attachData?.data ?? []).filter((d) => !isNil(d))) &&
						// summary.startsWith("really") &&
						renderImages(flatten(attachData?.data ?? []).map((d) => d!.number))}
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
					<Heart />
					<MessageCircle />
					<Send />
				</div>
				<div className="btn btn-sm rounded-full">Want To Buy</div>
			</div>
		</div>
	);
};

export default BuzzCard;
