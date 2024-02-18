import LoadingOverlay from "react-loading-overlay-ts";
import CreateForm, { UserInfo } from "./CreateForm";
import { useState } from "react";

import { toast } from "react-toastify";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";

const CreateMetaIDForm = ({ btcConnector }: { btcConnector: BtcConnector }) => {
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateMetaID = async (userInfo: UserInfo) => {
		console.log("userInfo", userInfo);

		setIsCreating(true);
		try {
			const res = await btcConnector.createMetaid({ name: userInfo.name });
			console.log("create metaid res", res);
		} catch (error) {
			console.log("create metaid error ", error);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.error((error as any)?.message);
		}
		toast.success("Successfulling created!");
		setIsCreating(false);
		console.log("your metaid", btcConnector.metaid);
		const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
		doc_modal.close();
	};

	return (
		<LoadingOverlay active={isCreating} spinner text="MetaID is Creating...">
			<CreateForm onSubmit={handleCreateMetaID} />
		</LoadingOverlay>
	);
};

export default CreateMetaIDForm;
