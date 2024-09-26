import CommentFormWrap from '../CommentFormWrap';
import { Pin } from '../../api/request';
import { UserInfo } from '../../store/user';
import { isEmpty } from 'ramda';
import { Connector } from '../../types';

type Iprops = {
  commentPin: Pin;
  commentToUser: UserInfo | undefined | null;
  connector: Connector;
};

const CommentModal = ({ commentPin, commentToUser, connector }: Iprops) => {
  return (
    <dialog id={'comment_buzz_modal_' + commentPin.id} className='modal !z-20'>
      <div className='modal-box bg-[#191C20] !z-20 py-5 w-[90%] lg:w-[50%]'>
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
            ✕
          </button>
        </form>
        <h3 className='font-medium text-white text-[16px] text-center'>
          {`Comment to @${
            !isEmpty(commentToUser?.name ?? '')
              ? commentToUser?.name
              : `MetaID-User-${commentToUser?.metaid.slice(0, 6)}`
          }`}
        </h3>
        <CommentFormWrap connector={connector!} commentPin={commentPin} />
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
}

export default CommentModal;
