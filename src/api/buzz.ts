import { BuzzItem } from "../types";
import axios from "axios";
import { type BtcEntity } from "@metaid/metaid/dist/core/entity/btc";
import { Pin } from "../components/BuzzList";
// export async function fetchBuzzs(page: number): Promise<BuzzItem[]> {
// 	const response = await axios.get(
// 		`http://localhost:3000/buzzes?_page=${page}&_limit=5&_sort=createTime&_order=desc`
// 	);
// 	return response.data;
// }

export type LikeRes = {
	_id: string;
	isLike: string;
	likeTo: string;
	pinAddress: string;
	pinId: string;
	pinNumber: number;
};

export async function fetchBuzzs({
	buzzEntity,
	page,
	limit,
}: {
	buzzEntity: BtcEntity;
	page: number;
	limit: number;
}): Promise<Pin[] | null> {
	console.log("fetcing");
	const response = await buzzEntity.getPins({ page, limit });
	return response;
}

export async function fetchCurrentBuzzLikes(pinId: string): Promise<LikeRes[] | null> {
	const body = {
		collection: "paylike",
		action: "get",
		filterRelation: "and",
		field: [],
		filter: [
			{
				operator: "=",
				key: "likeTo",
				value: pinId,
			},
		],
		cursor: 0,
		limit: 99999,
		sort: [],
	};

	// const response = await fetch(`https://man-test.metaid.io/api/generalQuery`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(body),
	// });
	// return response.json();

	try {
		const data = await axios
			.post(`https://man-test.metaid.io/api/generalQuery`, body)
			.then((res) => res.data);
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

////////////// mock buzz api

export async function fetchBuzz(id: string): Promise<BuzzItem> {
	const response = await axios.get(`http://localhost:3000/buzzes/${id}`);
	return response.data;
}

export async function createBuzz(newBuzz: BuzzItem): Promise<BuzzItem> {
	const response = await fetch(`http://localhost:3000/buzzes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newBuzz),
	});
	return response.json();
}

export async function updateBuzz(updatedBuzz: BuzzItem): Promise<BuzzItem> {
	const response = await fetch(`http://localhost:3000/buzzes/${updatedBuzz.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedBuzz),
	});
	return response.json();
}

export async function deleteBuzz(id: string) {
	const response = await fetch(`http://localhost:3000/buzzes/${id}`, {
		method: "DELETE",
	});
	return response.json();
}

////////////// mock buzz api
