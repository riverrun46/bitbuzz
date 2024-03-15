import { type BtcEntity } from '@metaid/metaid/dist/core/entity/btc';
// import { atom } from 'jotai';
// import { Pin } from '../components/BuzzList';
import { atomWithStorage } from 'jotai/utils';

export const buzzEntityAtom = atomWithStorage<BtcEntity | null>(
  'buzzEntity',
  null
);
// export const buzzPinsAtom = atom<Pin[] | []>([]);
