export type BtcNetwork = "mainnet" | "testnet" | "regtest";

export const BASE_METALET_TEST_URL = `https://www.metalet.space/wallet-api/v3`;

const BASE_METAID_URL_TESTNET = `https://man-test.metaid.io`;
const BASE_METAID_URL_REGEST = `https://man.somecode.link`;
const BASE_METAID_URL_MAINNET = ``;

export const MAN_BASE_URL_MAPPING = {
	testnet: BASE_METAID_URL_TESTNET,
	regtest: BASE_METAID_URL_REGEST,
	mainnet: BASE_METAID_URL_MAINNET,
};

export type Pin = {
	id: string;
	number: number;
	rootTxId: string;
	address: string;
	output: string;
	outputValue: number;
	timestamp: number;
	genesisFee: number;
	genesisHeight: number;
	genesisTransaction: string;
	txInIndex: number;
	txInOffset: number;
	operation: string;
	path: string;
	parentPath: string;
	encryption: string;
	version: string;
	contentType: string;
	contentBody: string;
	contentLength: number;
	contentSummary: string;
	status: number;
	originalId: string;
	isTransfered: boolean;
	preview: string;
	content: string;
	pop: string;
	metaid: string;
};
