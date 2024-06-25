import cls from 'classnames';

const ForwardBuzzAlertModal = () => {
  //   const onCloseAlertModal = () => {
  //     const doc_modal = document.getElementById(
  //       'alert_install_metalet_modal'
  //     ) as HTMLDialogElement;
  //     doc_modal.close();
  //   };
  return (
    <dialog id='forward_buzz_alert_modal' className='modal'>
      <div className='modal-box bg-[#191C20] flex flex-col gap-3 py-5 md:w-[90%] w-[50%]'>
        <button
          className={cls(
            'btn flex items-center btn-primary rounded-full w-full'
          )}
        >
          Forward
        </button>
        <button
          className={cls(
            'btn flex items-center btn-primary rounded-full w-full'
          )}
          onClick={() => {
            const doc_modal = document.getElementById(
              'repost_buzz_modal'
            ) as HTMLDialogElement;
            doc_modal.showModal();
          }}
        >
          Forward With Comment
        </button>
        <form method='dialog' className='modal-backdrop'>
          <button
            className={cls(
              'btn btn-outline text-gray flex items-center rounded-full w-full'
            )}
          >
            Cancel
          </button>
        </form>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ForwardBuzzAlertModal;
