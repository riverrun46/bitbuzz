import { BuzzItem } from "../../types";
import FollowButton from "../FollowButton";
import { Heart, MessageCircle, Send, Link as LucideLink } from "lucide-react";
import { isNil } from "ramda";
import cls from "classnames";
import dayjs from "dayjs";

type IProps = {
	buzzItem: BuzzItem | undefined;
	onBuzzDetail?: (txid: string) => void;
	innerRef?: React.Ref<HTMLDivElement>;
};

const BuzzCard = ({ buzzItem, onBuzzDetail, innerRef }: IProps) => {
	if (isNil(buzzItem)) {
		return <div>can't fetch this buzz</div>;
	}
	return (
		<div className="w-full border border-white rounded-xl flex flex-col gap-4" ref={innerRef}>
			<div className="flex items-center justify-between pt-4 px-4">
				<div className="flex gap-2 items-center">
					<img
						src="https://picsum.photos/200"
						alt="user avatar"
						className="rounded-full"
						width={40}
						height={40}
					/>
					<div className="text-gray">{buzzItem.user}</div>
				</div>
				<FollowButton isFollowed={buzzItem.isFollowed} />
			</div>
			<div
				className={cls("border-y border-white p-4", {
					"cursor-pointer": !isNil(onBuzzDetail),
				})}
				onClick={() => onBuzzDetail && onBuzzDetail(buzzItem.txid)}
			>
				<div>{buzzItem.content} </div>
				<div className="flex justify-between text-gray mt-2">
					<div className="flex gap-2 items-center">
						<LucideLink size={12} />
						<div>{buzzItem.txid}</div>
					</div>
					<div>{dayjs(buzzItem.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
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
