/* eslint-disable no-mixed-spaces-and-tabs */
import {
  IBtcConnector,
  IMetaletWalletForBtc,
  MetaletWalletForMvc,
  IMvcConnector,
} from '@metaid/metaid'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Chain, Connector } from '../types'

export type UserInfo = {
  number: number
  rootTxId: string
  name: string
  nameId: string
  avatarId: string
  bioId: string
  address: string
  avatar: string | null
  bio: string
  soulbondToken: string
  unconfirmed: string
  metaid: string
}

export const connectedAtom = atomWithStorage<boolean>('connectedAtom', false)
export const connectedNetworkAtom = atomWithStorage<Chain>(
  'connectedNetworkAtom',
  'btc',
)

export const btcConnectorAtom = atom<IBtcConnector | null>(null)
export const mvcConnectorAtom = atom<IMvcConnector | null>(null)
export const connectorAtom = atom<Connector | null>(null)
export const userInfoAtom = atom<UserInfo | null>(null)

export const walletAtom = atom<
  IMetaletWalletForBtc | MetaletWalletForMvc | undefined
>(undefined)

// export const userInfoAtom = atom<UserInfo | null>(null);
/**
 * unisat account stuff
 */
export const unisatInstalledAtom = atom(false)
export const accountsAtom = atom<string[]>([])
export const publicKeyAtom = atom('')
export const addressAtom = atom('')
export const balanceAtom = atom({
  confirmed: 0,
  unconfirmed: 0,
  total: 0,
})

export const globalFeeRateAtom = atom<string>('30')

export const walletRestoreParamsAtom = atomWithStorage<
  | {
      address: string
      pub: string
      xpub?: string
    }
  | undefined
>('walletRestoreParamsAtom', undefined)

export const myFollowingListAtom = atomWithStorage<string[]>(
  'myFollowingListAtom',
  [],
)
