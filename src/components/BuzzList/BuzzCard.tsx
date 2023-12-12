import FollowButton from "../FollowButton";
import { Heart, MessageCircle, Send, Link as LucideLink } from "lucide-react";
{
  /* <Link href="/post/1" className="hover:underline">
						Read more...
					</Link> */
}
const BuzzCard = () => {
  const buzz = {
    user: "Sophia_Qing",
    isFollowed: true,
    content:
      "I was watching Episode VI again when I noticed this. Who is that person behind the Emperor? The largest crypto exchange in the US, Coinbase, has made a notable move regarding the allegation from the US Securities and Exchange Commission on securities law violation.",
    txid: "0a930e...a1a",
  };
  return (
    <div className="w-full border border-white rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pt-4 px-4">
        <div className="flex gap-2 items-center">
          <img
            src="https://picsum.photos/200"
            alt="user avatar"
            className="rounded-full"
            width={40}
            height={40}
          />
          <div className="text-gray">{buzz.user}</div>
        </div>
        <FollowButton isFollowed={buzz.isFollowed} />
      </div>
      <div className="border-y border-white p-4">
        <div>{buzz.content} </div>
        <div className="flex justify-between text-gray mt-2">
          <div className="flex gap-2 items-center">
            <LucideLink size={12} />
            <div>{buzz.txid}</div>
          </div>
          <div>{"07:24 UTC"}</div>
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
