import { IBtcEntity, IMvcEntity } from '@metaid/metaid'
import { atom } from 'jotai'
// import { Pin } from '../components/BuzzList';

export const buzzEntityAtom = atom<IBtcEntity | IMvcEntity | null>(null)
// export const buzzPinsAtom = atom<Pin[] | []>([]);
