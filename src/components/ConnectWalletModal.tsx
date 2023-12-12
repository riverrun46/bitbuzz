import React, { useEffect, useRef } from "react";
import {
  accountsAtom,
  addressAtom,
  balanceAtom,
  connectedAtom,
  networkAtom,
  publicKeyAtom,
} from "@/store/user";
import { useAtom } from "jotai";
import { getBasicData } from "@/utils/wallet";

type IProps = { customClassName: string };

const ConnectWalletModal = ({ customClassName }: IProps) => {
  // const [unistaInstalled, setUnisatInstalled] = useAtom(unisatInstalledAtom);
  const [connected, setConnected] = useAtom(connectedAtom);
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [publicKey, setPublicKey] = useAtom(publicKeyAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [balance, setBalance] = useAtom(balanceAtom);
  const [network, setNetwork] = useAtom(networkAtom);
  const getBasicInfo = async () => {
    const [address, publicKey, balance, network] = await getBasicData();

    // const unisat = (window as any).unisat;
    // const [address] = await unisat.getAccounts();
    setAddress(address);

    // const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    // const balance = await unisat.getBalance();
    setBalance(balance);

    // const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });
  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };
  const handleConnectWallet = async () => {
    const unistaInstalled = await checkUnisat();
    if (!unistaInstalled) {
      alert("Unisat Wallet is not installed");
      return;
    }
    const unisat = (window as any).unisat;
    const result = await unisat.requestAccounts();
    handleAccountsChanged(result);
  };
  const handleNetworkChanged = (network: string) => {
    setNetwork(network);
    getBasicInfo();
  };

  async function checkUnisat() {
    let unisat = (window as any).unisat;

    for (let i = 1; i < 10 && !unisat; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100 * i));
      unisat = (window as any).unisat;
    }

    if (unisat) {
      return true;
    }
    return false;
  }

  // useEffect(() => {
  //   async function checkUnisat() {
  //     let unisat = (window as any).unisat;

  //     for (let i = 1; i < 10 && !unisat; i += 1) {
  //       await new Promise((resolve) => setTimeout(resolve, 100 * i));
  //       unisat = (window as any).unisat;
  //     }

  //     if (unisat) {
  //       setUnisatInstalled(true);
  //     } else if (!unisat) return;

  //     unisat.getAccounts().then((accounts: string[]) => {
  //       handleAccountsChanged(accounts);
  //     });

  //     unisat.on("accountsChanged", handleAccountsChanged);
  //     unisat.on("networkChanged", handleNetworkChanged);

  //     return () => {
  //       unisat.removeListener("accountsChanged", handleAccountsChanged);
  //       unisat.removeListener("networkChanged", handleNetworkChanged);
  //     };
  //   }

  //   checkUnisat().then();
  // }, []);
  return (
    <div className={customClassName} onClick={handleConnectWallet}>
      Connect Wallet
    </div>
  );
};

export default ConnectWalletModal;
