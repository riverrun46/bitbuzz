import { UserInfo } from "../store/user";
import { isEmpty, isNil } from "ramda";

const CustomAvatar = ({ userInfo }: { userInfo: UserInfo }) => {
	const userAlt =
		!isNil(userInfo?.name) && !isEmpty(userInfo?.name) ? userInfo.name : userInfo!.address;
	return !isNil(userInfo?.avatar) ? (
		<img
			src={userInfo?.avatar ?? ""}
			alt="user avatar"
			className="rounded-full self-start"
			width={45}
			height={45}
		/>
	) : (
		<div className="avatar placeholder">
			<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-12">
				<span>{userAlt.slice(-4, -2)}</span>
			</div>
		</div>
	);
};

export default CustomAvatar;
