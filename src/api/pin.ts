import axios from "axios";
import { BtcNetwork, MAN_BASE_URL_MAPPING, Pin } from "./request";

export async function getPinDetailByPid({
	pid,
	network,
}: {
	pid: string;
	network: BtcNetwork;
}): Promise<Pin | null> {
	const url = `${MAN_BASE_URL_MAPPING[network]}/api/pin/${pid}`;

	try {
		const data = await axios.get(url).then((res) => res.data);
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
