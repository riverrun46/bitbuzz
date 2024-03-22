/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingOverlay from "react-loading-overlay-ts";
import { useState } from "react";

import { toast } from "react-toastify";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import CreateMetaIdInfoForm from "./CreateMetaIdInfoForm";
import { useAtomValue } from "jotai";
import { walletAtom } from "../../store/user";
import { isNil } from "ramda";

export type MetaidUserInfo = {
	name: string;
	bio?: string;
	avatar?: string;
};

const CreateMetaIDFormWrap = ({
	btcConnector,
	onWalletConnectStart,
}: {
	btcConnector: BtcConnector;
	onWalletConnectStart: () => void;
}) => {
	const [isCreating, setIsCreating] = useState(false);
	const wallet = useAtomValue(walletAtom);
	const handleCreateMetaID = async (userInfo: MetaidUserInfo) => {
		console.log("userInfo", userInfo);
		console.log(
			"wallet balance",

			await wallet?.getBalance()
		);
		setIsCreating(true);

		const res = await btcConnector.createMetaid({ ...userInfo }).catch((error: any) => {
			setIsCreating(false);
			console.log("create metaid error ", "message", TypeError(error).message);
			const errorMessage = TypeError(error).message;

			const toastMessage = errorMessage.includes("Cannot read properties of undefined")
				? "User Canceled"
				: errorMessage;
			toast.error(toastMessage);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		});

		if (isNil(res?.metaid)) {
			toast.error("Create Failed");
		} else {
			toast.success("Successfully created!Now you can connect your wallet again!");
		}

		setIsCreating(false);
		console.log("your metaid", btcConnector.metaid);
		const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
		doc_modal.close();
		await onWalletConnectStart();
	};

	return (
		<LoadingOverlay active={isCreating} spinner text="Creating MetaID...">
			<CreateMetaIdInfoForm onSubmit={handleCreateMetaID} />
		</LoadingOverlay>
	);
};

export default CreateMetaIDFormWrap;
