import { useAtomValue } from 'jotai';
import { PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';

import { connectedAtom, userInfoAtom } from '../store/user';

import {
  checkMetaidInit,
  checkMetaletConnected,
  checkMetaletInstalled,
} from '../utils/wallet';
import BuzzFormWrap from './BuzzFormWrap';
import CustomAvatar from './CustomAvatar';

type IProps = {
  onWalletConnectStart: () => Promise<void>;
  onLogout: () => void;
};

const Navbar = ({ onWalletConnectStart, onLogout }: IProps) => {
  const connected = useAtomValue(connectedAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const onBuzzStart = async () => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);
    console.log('userinfo on buzz start', userInfo);
    await checkMetaidInit(userInfo!);
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
  console.log('userInfo', userInfo);
  return (
    <>
      <div className='z-10 navbar p-3 bg-main absolute top-0'>
        <div className='container flex justify-between'>
          <Link to={'/'} className="text-[30px] font-normal	font-['Impact']">
            BITBUZZ
          </Link>

          <div className='flex items-center gap-2'>
            <PencilLine
              className='border rounded-full text-main bg-[black] p-2 cursor-pointer'
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
                  className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                >
                  <li
                    className='hover:bg-[#E8E9EB] rounded-box'
                    onClick={onEditProfileStart}
                  >
                    <a>Edit Profile</a>
                  </li>
                  <li
                    className='hover:bg-[#E8E9EB] rounded-box'
                    onClick={onLogout}
                  >
                    <a>Log out</a>
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
      <dialog id='new_buzz_modal' className='modal'>
        <div className='modal-box bg-[#191C20] py-5 w-[50%]'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
              ✕
            </button>
          </form>
          <h3 className='font-medium text-white text-[16px] text-center'>
            New Releases
          </h3>
          <BuzzFormWrap />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Navbar;
