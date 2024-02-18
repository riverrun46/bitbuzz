import FollowButton from "../Buttons/FollowButton";

type Iprops = {
	isFollowed?: boolean;
	imgSeed: string;
};

const UserCard = ({ isFollowed, imgSeed }: Iprops) => {
	const user = {
		name: "Leo66",
		metaid: "826f3a",
		intro: "I am a Web3 lover, I like new and interesting things, and I am happy to make friends with you.",
	};
	return (
		<div className="border border-white p-4 rounded-xl">
			<div className="flex gap-2">
				<img
					src={`https://picsum.photos/seed/${imgSeed}/200`}
					alt="user avatar"
					className="rounded-full self-start"
					width={40}
					height={40}
				/>

				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<div className="flex flex-col gap-1">
							<div className="text-white">{user.name}</div>
							<div className="text-gray">MetaID: {user.metaid}</div>
						</div>
						<FollowButton isFollowed={isFollowed} />
					</div>
					<div className="text-white">{user.intro}</div>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
