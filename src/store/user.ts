import { type BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

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

export const connectedAtom = atomWithStorage('connected', false);
export const btcConnectorAtom = atomWithStorage<BtcConnector | null>(
  'btcConnector',
  null
);
export const userInfoAtom = atomWithStorage<UserInfo | null>('userInfo', null);
// export const userInfoAtom = atom<UserInfo | null>(null);
/**
 * unisat account stuff
 */
export const unisatInstalledAtom = atom(false);
export const accountsAtom = atom<string[]>([]);
export const publicKeyAtom = atom('');
export const addressAtom = atom('');
export const balanceAtom = atom({
  confirmed: 0,
  unconfirmed: 0,
  total: 0,
});
export const networkAtom = atom<string>('livenet');
