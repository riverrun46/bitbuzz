import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import CreateMetaIDFormWrap from './CreateMetaIDFormWrap';

type Iprops = {
  btcConnector: BtcConnector;
};

const CreateMetaIDModal = ({ btcConnector }: Iprops) => {
  return (
    <dialog id='create_metaid_modal' className='modal'>
      <div className='modal-box bg-[#191C20] py-5 w-[480px]'>
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
            ✕
          </button>
        </form>
        <h3 className='font-medium text-white text-[16px] text-center'>
          Set Up Profile
        </h3>
        <CreateMetaIDFormWrap btcConnector={btcConnector!} />
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CreateMetaIDModal;
