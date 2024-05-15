import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Buzz from './pages/Buzz';
import Home from './pages/Home';
import EditBuzz from './pages/EditBuzz';
import { ToastContainer, toast } from 'react-toastify';
import './globals.css';
import './react-toastify.css';
// import "react-toastify/dist/ReactToastify.css";
import { MetaletWalletForBtc, btcConnect } from '@metaid/metaid';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';

import { useAtom, useSetAtom } from 'jotai';
import {
  btcConnectorAtom,
  connectedAtom,
  networkAtom,
  userInfoAtom,
  walletAtom,
} from './store/user';
import { buzzEntityAtom } from './store/buzz';
import { errors } from './utils/errors';
import { isNil } from 'ramda';
import { checkMetaletInstalled } from './utils/wallet';
import { conirmMetaletTestnet } from './utils/wallet';
import CreateMetaIDModal from './components/MetaIDFormWrap/CreateMetaIDModal';
import EditMetaIDModal from './components/MetaIDFormWrap/EditMetaIDModal';
import { useEffect } from 'react';
import { BtcNetwork } from './api/request';

function App() {
  const setConnected = useSetAtom(connectedAtom);
  const setWallet = useSetAtom(walletAtom);
  const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);
  const [network, setNetwork] = useAtom(networkAtom);
  const setUserInfo = useSetAtom(userInfoAtom);

  const setBuzzEntity = useSetAtom(buzzEntityAtom);

  const onLogout = () => {
    setConnected(false);
    setBtcConnector(null);
    setBuzzEntity(null);
    setUserInfo(null);
    window.metaidwallet.removeListener('accountsChanged');
    window.metaidwallet.removeListener('networkChanged');
  };

  const onWalletConnectStart = async () => {
    await checkMetaletInstalled();
    const _wallet = await MetaletWalletForBtc.create();
    setWallet(_wallet);
    setNetwork((await window.metaidwallet.getNetwork()).network);
    await conirmMetaletTestnet();
    if (isNil(_wallet?.address)) {
      toast.error(errors.NO_METALET_LOGIN, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      throw new Error(errors.NO_METALET_LOGIN);
    }

    // add event listenr for accountsChanged networkChanged
    window.metaidwallet.on('accountsChanged', () => {
      onLogout();
      toast.error(
        'Wallet Account Changed ---- You have been automatically logged out of your current BitBuzz account. Please login again...',
        {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        }
      );
    });
    // window.metaidwallet.on('networkChanged', async (network: string) => {
    //   console.log('network', network);

    //   onLogout();
    //   toast.error(
    //     'Wallet Network Changed ---- You have been automatically logged out of your current BitBuzz account. Please Switch to Testnet login again...',
    //     {
    //       className:
    //         '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
    //     }
    //   );
    //   await window.metaidwallet.switchNetwork(
    //     network === ' testnet' ? 'regtest' : 'testnet'
    //   );
    // });
    window.addEventListener('beforeunload', (e) => {
      const confirmMessage = 'oos';
      e.returnValue = confirmMessage;
      return confirmMessage;
    });

    //////////////////////////
    const _btcConnector: BtcConnector = await btcConnect({
      network,
      wallet: _wallet,
    });

    setBtcConnector(_btcConnector as BtcConnector);

    // const doc_modal = document.getElementById(
    //   'create_metaid_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();
    // console.log("getUser", await _btcConnector.getUser());
    if (!_btcConnector.hasMetaid()) {
      const doc_modal = document.getElementById(
        'create_metaid_modal'
      ) as HTMLDialogElement;
      doc_modal.showModal();
    } else {
      const resUser = await _btcConnector.getUser({ network });
      console.log('user now', resUser);
      setUserInfo(resUser);
      setConnected(true);
      setBuzzEntity(await _btcConnector.use('buzz'));
      console.log('your btc address: ', _btcConnector.address);
    }
  };

  const getBuzzEntity = async () => {
    const _btcConnector: BtcConnector = await btcConnect({ network });
    setBtcConnector(_btcConnector);
    const _buzzEntity = await _btcConnector.use('buzz');
    setBuzzEntity(_buzzEntity);

    setNetwork((await window.metaidwallet.getNetwork()).network);
  };

  useEffect(() => {
    getBuzzEntity();
  }, []);

  useEffect(() => {
    if (!isNil(window?.metaidwallet)) {
      window.metaidwallet.on('networkChanged', async (network: BtcNetwork) => {
        toast.error('Wallet Network Changed!', {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        });
        setNetwork(network ?? 'testnet');
        // await window.metaidwallet.switchNetwork(
        //   network === ' testnet' ? 'regtest' : 'testnet'
        // );
      });
    }
  }, [window?.metaidwallet]);

  // const handleTest = async () => {
  // 	// console.log('connected', connected);
  // 	// console.log('userinfo', userInfo);
  // 	// console.log('buzzEntity', buzzEntity);
  // 	// console.log('btcConnector', btcConnector);
  // 	// console.log('buzzentity res', await btcConnector!.use('buzz'));
  // 	// toast.success("create buzz successfully");
  // 	const success_modal = document.getElementById(
  // 		"create_metaid_success_modal"
  // 	) as HTMLDialogElement;
  // 	success_modal.showModal();
  // };

  return (
    <div className='relative overflow-auto'>
      <Navbar onWalletConnectStart={onWalletConnectStart} onLogout={onLogout} />

      <div className='container pt-[100px] bg-[black] text-white h-screen'>
        {/* <button
					className="btn btn-active btn-accent text-[blue] absolute top-18 left-2"
					onClick={handleTest}
				>
					Test Button
				</button> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/buzz/:id' element={<Buzz />} />
          <Route path='/buzz/:id/edit' element={<EditBuzz />} />
        </Routes>
      </div>
      <ToastContainer
        position='top-left'
        toastStyle={{
          position: 'absolute',
          top: '80px',
          left: '120px',
          width: '380px',
        }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        closeButton={false}
      />

      <CreateMetaIDModal
        btcConnector={btcConnector!}
        onWalletConnectStart={onWalletConnectStart}
      />
      <EditMetaIDModal btcConnector={btcConnector!} />
    </div>
  );
}

export default App;
