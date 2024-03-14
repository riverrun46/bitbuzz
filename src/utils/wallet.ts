import { toast } from "react-toastify";
import { errors } from "./errors";
import { UserInfo } from "../store/user";

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

export const checkMetaidInit = async (userInfo: UserInfo) => {
	if (userInfo.unconfirmed.split(",").includes("number")) {
		toast.warn(errors.INIT_STILL_MEMPOOL);
		throw new Error(errors.INIT_STILL_MEMPOOL);
	}
};
