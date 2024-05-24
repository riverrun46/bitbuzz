// import { BuzzItem } from '../types';
import axios from 'axios';
import { Pin } from '../components/BuzzList';
import { BtcNetwork } from './request';
import { IBtcEntity } from '@metaid/metaid';
import { environment } from '../utils/environments';

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
  buzzEntity: IBtcEntity;
  page: number;
  limit: number;
  network: BtcNetwork;
}): Promise<Pin[] | null> {
  const response = await buzzEntity.list({ page, limit, network });

  return response;
}

export async function fetchCurrentBuzzLikes({
  pinId,
}: {
  pinId: string;
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

  try {
    const data = await axios
      .post(`${environment.base_man_url}/api/generalQuery`, body)
      .then((res) => res.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPinDetailByPid({
  pid,
}: {
  pid: string;
}): Promise<Pin | undefined> {
  const url = `${environment.base_man_url}/api/pin/${pid}`;

  try {
    const data = await axios.get(url).then((res) => res.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return undefined;
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
  netWork?: BtcNetwork;
}): Promise<FeeRateApi> {
  const response = await fetch(
    `https://mempool.space/${
      netWork === 'mainnet' ? '' : 'testnet/'
    }api/v1/fees/recommended`,
    {
      method: 'get',
    }
  );
  return response.json();
}

////////////// mock buzz api
