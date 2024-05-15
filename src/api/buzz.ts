// import { BuzzItem } from '../types';
import axios from 'axios';
import { type BtcEntity } from '@metaid/metaid/dist/core/entity/btc';
import { Pin } from '../components/BuzzList';
import { BtcNetwork, MAN_BASE_URL_MAPPING } from './request';

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
  network,
}: {
  buzzEntity: BtcEntity;
  page: number;
  limit: number;
  network?: BtcNetwork;
}): Promise<Pin[] | null> {
  const response = await buzzEntity.list({ page, limit, network });

  return response;
}

export async function fetchCurrentBuzzLikes({
  pinId,
  network,
}: {
  pinId: string;
  network: BtcNetwork;
}): Promise<LikeRes[] | null> {
  const body = {
    collection: 'paylike',
    action: 'get',
    filterRelation: 'and',
    field: [],
    filter: [
      {
        operator: '=',
        key: 'likeTo',
        value: pinId,
      },
    ],
    cursor: 0,
    limit: 99999,
    sort: [],
  };

  // const response = await fetch(`${MAN_BASE_URL_MAPPING[network]}/api/generalQuery`, {
  // 	method: "POST",
  // 	headers: {
  // 		"Content-Type": "application/json",
  // 	},
  // 	body: JSON.stringify(body),
  // });
  // return response.json();

  try {
    const data = await axios
      .post(`${MAN_BASE_URL_MAPPING[network]}/api/generalQuery`, body)
      .then((res) => res.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

////////////// mock buzz api

// export async function fetchBuzz(id: string): Promise<BuzzItem> {
// 	const response = await axios.get(`http://localhost:3000/buzzes/${id}`);
// 	return response.data;
// }

// export async function createBuzz(newBuzz: BuzzItem): Promise<BuzzItem> {
// 	const response = await fetch(`http://localhost:3000/buzzes`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(newBuzz),
// 	});
// 	return response.json();
// }

// export async function updateBuzz(updatedBuzz: BuzzItem): Promise<BuzzItem> {
// 	const response = await fetch(`http://localhost:3000/buzzes/${updatedBuzz.id}`, {
// 		method: "PUT",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(updatedBuzz),
// 	});
// 	return response.json();
// }

// export async function deleteBuzz(id: string) {
// 	const response = await fetch(`http://localhost:3000/buzzes/${id}`, {
// 		method: "DELETE",
// 	});
// 	return response.json();
// }

export type FeeRateApi = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export async function fetchFeeRate({
  netWork,
}: {
  netWork?: 'testnet' | 'mainnet';
}): Promise<FeeRateApi> {
  const response = await fetch(
    `https://mempool.space/${
      netWork === 'mainnet' ? '' : 'testnet'
    }/api/v1/fees/recommended`,
    {
      method: 'get',
    }
  );
  return response.json();
}

////////////// mock buzz api
