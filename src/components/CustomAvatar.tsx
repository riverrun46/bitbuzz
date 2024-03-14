import { UserInfo } from "../store/user";
import { isEmpty, isNil } from "ramda";

const CustomAvatar = ({ userInfo }: { userInfo: UserInfo }) => {
	const hasName = !isNil(userInfo?.name) && !isEmpty(userInfo?.name);
	const hasAvatar = !isNil(userInfo?.avatar) && !isEmpty(userInfo?.avatar);
	const userAlt = hasName ? userInfo.name.slice(0, 2) : userInfo!.address.slice(-4, -2);
	const src = `https://man-test.metaid.io${userInfo?.avatar ?? ""}`;
	return hasAvatar ? (
		<img src={src} alt="user avatar" className="rounded-full self-start w-12 h-12" />
	) : (
		<div className="avatar placeholder">
			<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-12">
				<span>{userAlt}</span>
			</div>
		</div>
	);
};

export default CustomAvatar;
