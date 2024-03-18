import { type BtcEntity } from '@metaid/metaid/dist/core/entity/btc';
import { atom } from 'jotai';
// import { Pin } from '../components/BuzzList';

export const buzzEntityAtom = atom<BtcEntity | null>(null);
// export const buzzPinsAtom = atom<Pin[] | []>([]);
