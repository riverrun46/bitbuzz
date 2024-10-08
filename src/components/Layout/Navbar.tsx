import { useAtom, useAtomValue } from 'jotai'
import {
  ArrowLeftRightIcon,
  ArrowRightLeft,
  BookCheck,
  PencilLine,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  connectedAtom,
  connectedNetworkAtom,
  globalFeeRateAtom,
  userInfoAtom,
} from '../../store/user'

import {
  checkMetaletConnected,
  checkMetaletInstalled,
  checkUserNameExisted,
} from '../../utils/wallet'
import CustomAvatar from '../Public/CustomAvatar'

import AboutModal from '../Modals/AboutModal'
import NavabarMobileMenu from './NavabarMobileMenu'
import NewBuzzModal from '../Modals/NewBuzzModal'
import classNames from 'classnames'
import { Connector } from '../../types'

type IProps = {
  onWalletConnectStart: () => Promise<void>
  onWalletConnectMVCStart: () => Promise<void>
  onSwitchToAnotherNetwork: () => void
  onLogout: () => void
  connector: Connector
}

const Navbar = ({
  onWalletConnectStart,
  onWalletConnectMVCStart,
  onSwitchToAnotherNetwork,
  onLogout,
  connector,
}: IProps) => {
  const [globalFeeRate, setGlobalFeeRate] = useAtom(globalFeeRateAtom)

  const connected = useAtomValue(connectedAtom)
  const [connectedNetwork, setConnectedNetwork] = useAtom(connectedNetworkAtom)
  const userInfo = useAtomValue(userInfoAtom)

  const onBuzzStart = async () => {
    await checkMetaletInstalled()
    await checkMetaletConnected(connected)
    await checkUserNameExisted(userInfo?.name ?? '')

    const doc_modal = document.getElementById(
      'new_buzz_modal',
    ) as HTMLDialogElement
    doc_modal.showModal()
  }

  const onEditProfileStart = async () => {
    const doc_modal = document.getElementById(
      'edit_metaid_modal',
    ) as HTMLDialogElement
    doc_modal.showModal()
  }

  return (
    <>
      <AboutModal />

      <div className='z-10 navbar py-3 px-0 bg-main absolute top-0'>
        <div className='container flex justify-between'>
          <div className='flex justify-start'>
            <Link to={'/'} className='md:block hidden'>
              <img src='/logo_navbar.png' className='w-[100px] h-[26px]' />
            </Link>

            <div className='text-sm sm:inline-flex self-end ml-2 hidden text-lime-800 items-center'>
              on{'  '}
              {connectedNetwork === 'btc' ? (
                <img src='/btc.png' className='h-4 w-4 shrink-0 ml-1' />
              ) : (
                <img src='/mvc.png' className='h-4 w-4 shrink-0 ml-1' />
              )}
              <span className='font-bold'>
                {connectedNetwork === 'btc' ? 'BTC' : 'MVC'}
              </span>
            </div>

            <NavabarMobileMenu />
          </div>

          <div className='flex items-center gap-2'>
            <div className='gap-4 hidden md:flex'>
              <a
                href='https://docs.metaid.io/'
                className='text-lime-900 font-bold hover:underline hover:text-lime-700'
                target='_blank'
              >
                Docs
              </a>
              <button
                className='text-lime-900 font-bold hover:underline hover:text-lime-700'
                onClick={() => {
                  const doc_modal = document.getElementById(
                    'about_modal',
                  ) as HTMLDialogElement
                  doc_modal.showModal()
                }}
              >
                About
              </button>
              <div className='border-r border border-[#1D2F2F]/50 mr-2'></div>
            </div>

            {/* feeb select */}
            {connectedNetwork === 'btc' && (
              <div className='inline-flex items-center gap-2'>
                <img
                  src='/charging-pile.png'
                  className='w-[30px] h-[35px] hidden md:block'
                />
                <input
                  inputMode='numeric'
                  type='number'
                  min={0}
                  max={'100000'}
                  style={{
                    appearance: 'textfield',
                  }}
                  aria-hidden
                  className='w-[65px] h-[32px] input input-xs  bg-[black]  shadow-inner !pr-0 border-none focus:border-main text-main focus:outline-none  hidden md:block'
                  step={1}
                  value={globalFeeRate}
                  onChange={(e) => {
                    const v = e.currentTarget.value
                    setGlobalFeeRate(v)
                  }}
                />
                <div className='text-[#1D2F2F] hidden md:block'>sat/vB</div>
              </div>
            )}

            <PencilLine
              className='border rounded-full text-main bg-[black] p-2 cursor-pointer ml-2 w-9 h-9 md:w-12 md:h-12'
              // size={45}
              onClick={onBuzzStart}
            />

            {connected ? (
              <div className='dropdown dropdown-hover'>
                <div
                  tabIndex={0}
                  role='button'
                  className='cursor-pointer md:hidden block'
                >
                  <CustomAvatar userInfo={userInfo!} size='36px' />
                </div>

                <div
                  tabIndex={0}
                  role='button'
                  className='cursor-pointer md:block hidden relative'
                >
                  <CustomAvatar userInfo={userInfo!} />
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content z-[1] menu px-4 py-4 gap-3 shadow bg-main rounded-box w-[240px] border border-[#131519] right-0'
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
                    onClick={onSwitchToAnotherNetwork}
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
                    >
                      {`Switch to ${connectedNetwork === 'btc' ? 'MVC' : 'BTC'}`}
                      {connectedNetwork === 'btc' ? (
                        <img src='/mvc.png' className='h-6 w-6 shrink-0' />
                      ) : (
                        <img src='/btc.png' className='h-6 w-6 shrink-0' />
                      )}
                    </a>
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
              <button
                className='btn-sm w-[120px] text-[12px] md:text-[14px] md:btn-md md:w-[180px] btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium'
                onClick={() =>
                  // @ts-ignore
                  document.getElementById('connect_modal').showModal()
                }
              >
                Connect Wallet
              </button>

              // <div
              //   className='btn-sm w-[120px] text-[12px] md:text-[14px] md:btn-md md:w-[180px] btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium'
              //   onClick={onWalletConnectStart}
              // >
              //   Connect Wallet
              // </div>
            )}

            <dialog id='connect_modal' className='modal'>
              <div className='modal-box bg-[#191C20] py-5 w-[90%] lg:w-auto'>
                <div className='flex flex-col relative items-start'>
                  <h3 className='text-white text-xl mb-8'>Connect Wallet</h3>

                  <div className='flex gap-4 flex-col justify-center items-center self-stretch'>
                    <button
                      className='btn-sm w-[70vw] text-[12px] md:text-[14px] md:btn-md md:w-[300px] btn btn-outline hover:bg-[black] hover:text-main text-main rounded-full font-medium py-4 h-auto'
                      onClick={onWalletConnectStart}
                    >
                      BTC Network
                    </button>

                    <button
                      className='btn-sm w-[70vw] text-[12px] md:text-[14px] md:btn-md md:w-[300px] btn btn-outline hover:bg-[black] hover:text-main text-main rounded-full font-medium py-4 h-auto'
                      onClick={onWalletConnectMVCStart}
                    >
                      MVC Network
                    </button>
                  </div>
                </div>
              </div>

              <form method='dialog' className='modal-backdrop'>
                <button id='closeConnectModalBtn'>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>
      <NewBuzzModal connector={connector} />
    </>
  )
}

export default Navbar
