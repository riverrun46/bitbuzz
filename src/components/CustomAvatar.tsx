import { useAtomValue } from "jotai";
import { UserInfo, networkAtom } from "../store/user";
import { isEmpty, isNil } from "ramda";
import { MAN_BASE_URL_MAPPING } from "../api/request";

const CustomAvatar = ({ userInfo }: { userInfo: UserInfo }) => {
	const network = useAtomValue(networkAtom);

	const hasName = !isNil(userInfo?.name) && !isEmpty(userInfo?.name);
	const hasAvatar = !isNil(userInfo?.avatar) && !isEmpty(userInfo?.avatar);
	const userAlt = hasName ? userInfo.name.slice(0, 2) : (userInfo?.address ?? "").slice(-4, -2);
	const src = `${MAN_BASE_URL_MAPPING[network]}${userInfo?.avatar ?? ""}`;
	return hasAvatar ? (
		<img
			src={src}
			alt="user avatar"
			className="rounded-full self-start w-[48px] h-[48px]"
			style={{
				objectFit: "cover",
			}}
		/>
	) : (
		<div className="avatar placeholder">
			<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-12">
				<span>{userAlt}</span>
			</div>
		</div>
	);
};

export default CustomAvatar;
