import axios from "axios";

const BASE_METAID_TEST_URL = `https://man-test.metaid.io`;

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
};

export async function getPinDetailByPid({
	pid,
}: {
	pid: string;
	network?: "livenet" | "testnet";
}): Promise<Pin[] | null> {
	const url = `${BASE_METAID_TEST_URL}/api/btc/pin/${pid}`;

	try {
		const data = await axios.get(url).then((res) => res.data);
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
