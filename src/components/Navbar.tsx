import { useAtomValue } from "jotai";
import { PencilLine } from "lucide-react";
import { Link } from "react-router-dom";

import { connectedAtom, userInfoAtom } from "../store/user";

import { checkMetaletConnected, checkMetaletInstalled } from "../utils/wallet";
import BuzzFormWrap from "./BuzzFormWrap";
import CustomAvatar from "./CustomAvatar";

type IProps = {
	onWalletConnectStart: () => Promise<void>;
};

const Navbar = ({ onWalletConnectStart }: IProps) => {
	const connected = useAtomValue(connectedAtom);
	const userInfo = useAtomValue(userInfoAtom);
	const onBuzzStart = async () => {
		await checkMetaletInstalled();
		await checkMetaletConnected(connected);
		const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
		doc_modal.showModal();
	};
	console.log("userInfo", userInfo);
	return (
		<>
			<div className="z-10 navbar p-3 bg-main absolute top-0">
				<div className="container flex justify-between">
					<Link to={"/"} className="text-[30px] font-normal	font-['Impact']">
						BITBUZZ
					</Link>

					<div className="flex items-center gap-2">
						<PencilLine
							className="border rounded-full text-main bg-[black] p-2 cursor-pointer"
							size={45}
							onClick={onBuzzStart}
						/>

						{connected ? (
							<CustomAvatar userInfo={userInfo!} />
						) : (
							<div
								className="btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium w-[180px]"
								onClick={onWalletConnectStart}
							>
								Connect Wallet
							</div>
						)}
					</div>
				</div>
			</div>
			<dialog id="new_buzz_modal" className="modal">
				<div className="modal-box bg-[#191C20] py-5 w-[50%]">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5">
							✕
						</button>
					</form>
					<h3 className="font-medium text-white text-[16px] text-center">New Releases</h3>
					<BuzzFormWrap />
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
};

export default Navbar;
