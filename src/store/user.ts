import { type BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import { atom } from "jotai";

export type UserInfo = {
	number: number;
	rootTxId: string;
	name: string;
	address: string;
	avatar: string | null;
	bio: string;
	soulbondToken: string;
	unconfirmed: string;
};

export const connectedAtom = atom(false);
export const btcConnectorAtom = atom<BtcConnector | null>(null);

/**
 * unisat account stuff
 */
export const unisatInstalledAtom = atom(false);
export const accountsAtom = atom<string[]>([]);
export const publicKeyAtom = atom("");
export const addressAtom = atom("");
export const balanceAtom = atom({
	confirmed: 0,
	unconfirmed: 0,
	total: 0,
});
export const networkAtom = atom<string>("livenet");

export const userInfoAtom = atom<UserInfo | null>(null);
