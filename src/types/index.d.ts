import { IBtcConnector, IMvcConnector } from "@metaid/metaid";

export type BuzzItem = {
	user: string;
	isFollowed: boolean;
	content: string;
	txid: string;
	id: string;
	createTime: string;
};

export type Chain = 'btc' | 'mvc'

export type Connector = IBtcConnector | IMvcConnector