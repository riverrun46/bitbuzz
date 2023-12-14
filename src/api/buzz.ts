import { BuzzItem } from "../types";
import axios from "axios";
export async function fetchBuzzs(page: number): Promise<BuzzItem[]> {
	const response = await axios.get(
		`http://localhost:3000/buzzes?_page=${page}&_limit=5&_sort=createTime&_order=desc`
	);
	return response.data;
}

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
