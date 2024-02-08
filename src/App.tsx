import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Buzz from './pages/Buzz';
import Home from './pages/Home';
import EditBuzz from './pages/EditBuzz';
import { ToastContainer, toast } from 'react-toastify';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { MetaletWalletForBtc, btcConnect } from '@metaid/metaid';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import { useSetAtom } from 'jotai';
import { btcConnectorAtom, connectedAtom } from './store/user';
import { buzzEntityAtom } from './store/buzz';

function App() {
  const setConnected = useSetAtom(connectedAtom);
  const setBtcConnector = useSetAtom(btcConnectorAtom);
  const setBuzzEntity = useSetAtom(buzzEntityAtom);
  const onWalletConnectStart = async () => {
    const _wallet = await MetaletWalletForBtc.create();

    const _btcConnector: BtcConnector = await btcConnect(_wallet);
    setConnected(true);
    setBtcConnector(_btcConnector as BtcConnector);

    if (!_btcConnector.hasMetaid()) {
      toast.loading('We are creating a metaid for you...');
      try {
        const res = await _btcConnector.createMetaid();
        console.log('create metaid res', res);
      } catch (error) {
        console.log('create metaid error ', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((error as any)?.message);
      }
      toast.success('Successfulling created!');
      console.log('your metaid', _btcConnector.metaid);
    }
    setBuzzEntity(await _btcConnector.use('buzz'));
    console.log('your btc address: ', _btcConnector.address);
  };

  return (
    <div className='relative'>
      <Navbar onWalletConnectStart={onWalletConnectStart} />
      <div className='container pt-[100px] text-white h-screen overflow-auto'>
        <Routes>
          <Route
            path='/'
            element={<Home onWalletConnectStart={onWalletConnectStart} />}
          />
          <Route path='/buzz/:id' element={<Buzz />} />
          <Route path='/buzz/:id/edit' element={<EditBuzz />} />
        </Routes>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
}

export default App;
