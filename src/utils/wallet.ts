import { toast } from "react-toastify";
import { errors } from "./errors";

export const checkMetaletInstalled = async () => {
	const metalet = window?.metaidwallet;
	// const connectRes = await metalet?.connect();
	if (typeof metalet === "undefined") {
		toast.warn(
			"It appears that you do not have Metalet Wallet Extentsion installed or have not created a wallet account."
		);
		throw new Error(errors.NO_METALET_DETECTED);
	}
};

export const checkMetaletConnected = async (connected: boolean) => {
	if (!connected) {
		toast.warn(errors.NO_WALLET_CONNECTED);
		throw new Error(errors.NO_WALLET_CONNECTED);
	}
};
