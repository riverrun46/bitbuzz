/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingOverlay from 'react-loading-overlay-ts';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import CreateMetaIdInfoForm from './CreateMetaIdInfoForm';

export type MetaidUserInfo = {
  name: string;
  bio?: string;
  avatar?: string;
};

const CreateMetaIDFormWrap = ({
  btcConnector,
  onWalletConnectStart,
}: {
  btcConnector: BtcConnector;
  onWalletConnectStart: () => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMetaID = async (userInfo: MetaidUserInfo) => {
    console.log('userInfo', userInfo);

    setIsCreating(true);
    try {
      const res = await btcConnector.createMetaid({ ...userInfo });
      console.log('create metaid res', res);
    } catch (error) {
      console.log('create metaid error ', error);
      const errorMessage = (error as any)?.message;
      const toastMessage = errorMessage.includes(
        'Cannot read properties of undefined'
      )
        ? 'User Canceled'
        : errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(toastMessage);
    }
    toast.success(
      'Successfully created!Now you can connect your wallet again!'
    );
    setIsCreating(false);
    console.log('your metaid', btcConnector.metaid);
    const doc_modal = document.getElementById(
      'create_metaid_modal'
    ) as HTMLDialogElement;
    doc_modal.close();
    await onWalletConnectStart();
  };

  return (
    <LoadingOverlay
      active={isCreating}
      spinner
      text='MetaID is Being Creating...'
    >
      <CreateMetaIdInfoForm onSubmit={handleCreateMetaID} />
    </LoadingOverlay>
  );
};

export default CreateMetaIDFormWrap;
