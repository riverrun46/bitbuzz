import { atom } from "jotai";

export const unisatInstalledAtom = atom(false);
export const connectedAtom = atom(false);
export const accountsAtom = atom<string[]>([]);
export const publicKeyAtom = atom("");
export const addressAtom = atom("");
export const balanceAtom = atom({
  confirmed: 0,
  unconfirmed: 0,
  total: 0,
});
export const networkAtom = atom<string>("livenet");
