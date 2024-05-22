import { useAtom, useAtomValue } from 'jotai';
import { PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';

import { connectedAtom, globalFeeRateAtom, userInfoAtom } from '../store/user';

import { checkMetaletConnected, checkMetaletInstalled } from '../utils/wallet';
import BuzzFormWrap from './BuzzFormWrap';
import CustomAvatar from './CustomAvatar';
// import { BtcNetwork } from '../api/request';
// import { toast } from 'react-toastify';
import { IBtcConnector } from '@metaid/metaid';

type IProps = {
  onWalletConnectStart: () => Promise<void>;
  onLogout: () => void;
  btcConnector: IBtcConnector;
};

const Navbar = ({ onWalletConnectStart, onLogout, btcConnector }: IProps) => {
  // const networks = ['Mainnet', 'Testnet', 'Regtest'];
  const [globalFeeRate, setGlobalFeeRate] = useAtom(globalFeeRateAtom);
  // const [network, setNetwork] = useAtom(networkAtom);
  // const setWalletParams = useSetAtom(walletRestoreParamsAtom);
  // const [connected, setConnected] = useAtom(connectedAtom);
  // const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const connected = useAtomValue(connectedAtom);
  const userInfo = useAtomValue(userInfoAtom);

  const onBuzzStart = async () => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);
    // const stillPool = await checkMetaidInitStillPool(userInfo!);

    const doc_modal = document.getElementById(
      'new_buzz_modal'
    ) as HTMLDialogElement;
    doc_modal.showModal();
  };

  const onEditProfileStart = async () => {
    const doc_modal = document.getElementById(
      'edit_metaid_modal'
    ) as HTMLDialogElement;
    doc_modal.showModal();
  };

  // const handleSwitchNetwork = async (network: BtcNetwork) => {
  // 	setUserInfo(null);
  // 	setConnected(false);
  // 	setWalletParams(undefined);
  // 	const res = await window.metaidwallet.switchNetwork({ network: network });
  // 	if (res.status === "ok") {
  // 		toast.success("switch network successfully!");
  // 		setNetwork(res.network);
  // 	} else if (res.status === "canceled") {
  // 		toast.error("switch cancelled!", {
  // 			className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
  // 		});
  // 		return;
  // 	} else {
  // 		toast.error("switch network failed!", {
  // 			className: "!text-[#DE613F]!bg-[black] border border-[#DE613f]!rounded-lg",
  // 		});
  // 	}
  // };

  return (
    <>
      <div className='z-10 navbar p-3 bg-main absolute top-0'>
        <div className='container flex justify-between'>
          <div className='flex items-center gap-2'>
            <Link to={'/'}>
              <img src='/logo_navbar.png' width={100} height={45} />
            </Link>
            {/* <div className='dropdown dropdown-hover'>
              <div
                className='border btn-xs btn rounded-md text-main bg-[black] cursor-pointer hover:bg-[black]'
                tabIndex={0}
                role='button'
              >
                {network ?? 'testnet'}
              </div>
              <ul
                tabIndex={0}
                className='dropdown-content z-[1] menu px-4 py-4 gap-3 shadow bg-main rounded-box w-[120px] border border-[#131519] left-[-30px]'
                style={{
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px 0px rgba(169, 211, 18, 0.5)',
                }}
              >
                {networks.map((network, index) => {
                  return (
                    <div key={network}>
                      <li
                        className='hover:bg-[rgba(219, 243, 136, 0.5)] rounded-box relative'
                        key={network}
                        onClick={() =>
                          handleSwitchNetwork(
                            network.toLowerCase() as BtcNetwork
                          )
                        }
                      >
                        <a
                          className='text-[#1D2F2F] text-[14px]'
                          // style={{ textIndent: '2.2em' }}
                        >
                          {network}
                        </a>
                      </li>
                      {index !== 2 && (
                        <div className='border border-[#1D2F2F]/50 w-[80%] mx-auto'></div>
                      )}
                    </div>
                  );
                })}
              </ul>
            </div> */}
          </div>

          <div className='flex items-center gap-2'>
            <div className='text-gray'>Fee Rate:</div>
            <input
              inputMode='numeric'
              type='number'
              min={0}
              max={'100000'}
              style={{
                appearance: 'textfield',
              }}
              aria-hidden
              className='w-[80px] input input-xs  bg-gray/40  shadow-inner !pr-0 border-none focus:border-main text-main focus:outline-none'
              step={1}
              value={globalFeeRate}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setGlobalFeeRate(v);
              }}
            />

            <PencilLine
              className='border rounded-full text-main bg-[black] p-2 cursor-pointer ml-2'
              size={45}
              onClick={onBuzzStart}
            />

            {connected ? (
              <div className='dropdown dropdown-hover'>
                {/* <div tabIndex={0} role="button" className="btn m-1">Hover</div> */}
                <div tabIndex={0} role='button' className='cursor-pointer'>
                  <CustomAvatar userInfo={userInfo!} />
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content z-[1] menu px-4 py-4 gap-3 shadow bg-main rounded-box w-[170px] border border-[#131519] left-[-86px]'
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0px 4px 10px 0px rgba(169, 211, 18, 0.5)',
                  }}
                >
                  <li
                    className='hover:bg-[rgba(219, 243, 136, 0.5)] rounded-box relative'
                    onClick={onEditProfileStart}
                  >
                    <img
                      src='/profile-icon.png'
                      width={55}
                      height={55}
                      className='absolute left-0 top-0'
                    />
                    <a
                      className='text-[#1D2F2F] text-[14px]'
                      style={{ textIndent: '2.2em' }}
                    >{`Edit Profile`}</a>
                  </li>
                  <div className='border border-[#1D2F2F]/50 w-[80%] mx-auto'></div>
                  <li
                    className='hover:bg-[rgba(219, 243, 136, 0.5)] rounded-box relative'
                    onClick={onLogout}
                  >
                    <img
                      src='/logout-icon.png'
                      width={55}
                      height={55}
                      className='absolute left-0 top-0'
                    />
                    <a
                      className='text-[#1D2F2F] text-[14px]'
                      style={{ textIndent: '2.5em' }}
                    >
                      Disconnect
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div
                className='btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium w-[180px]'
                onClick={onWalletConnectStart}
              >
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
      <dialog id='new_buzz_modal' className='modal  !z-20'>
        <div className='modal-box bg-[#191C20] !z-20 py-5 w-[50%]'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
              ✕
            </button>
          </form>
          <h3 className='font-medium text-white text-[16px] text-center'>
            New Buzz
          </h3>
          <BuzzFormWrap btcConnector={btcConnector} />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Navbar;
