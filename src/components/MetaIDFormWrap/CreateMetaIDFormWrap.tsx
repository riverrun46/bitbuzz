/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingOverlay from 'react-loading-overlay-ts';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import CreateMetaIdInfoForm from './CreateMetaIdInfoForm';
import { useAtomValue } from 'jotai';
import { walletAtom } from '../../store/user';
import { isNil } from 'ramda';
import { useQuery } from '@tanstack/react-query';
import { fetchFeeRate } from '../../api/buzz';

export type MetaidUserInfo = {
  name: string;
  bio?: string;
  avatar?: string;
  feeRate?: number;
};

const CreateMetaIDFormWrap = ({
  btcConnector,
  onWalletConnectStart,
}: {
  btcConnector: BtcConnector;
  onWalletConnectStart: () => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [balance, setBalance] = useState('0');
  const wallet = useAtomValue(walletAtom);

  const { data: feeRateData } = useQuery({
    queryKey: ['feeRate'],
    queryFn: () => fetchFeeRate({ netWork: 'testnet' }),
  });

  const getBtcBalance = async () => {
    if (!isNil(wallet)) {
      setBalance(((await wallet?.getBalance())?.confirmed ?? 0).toString());
    }
  };

  useEffect(() => {
    getBtcBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const handleCreateMetaID = async (userInfo: MetaidUserInfo) => {
    // console.log("userInfo", userInfo);
    console.log(
      'wallet balance',

      await wallet?.getBalance()
    );
    setBalance(
      ((await window.metaidwallet?.btc.getBalance())?.confirmed ?? 0).toString()
    );
    setIsCreating(true);

    const res = await btcConnector
      .createMetaid({ ...userInfo, feeRate: feeRateData?.fastestFee ?? 47 })
      .catch((error: any) => {
        setIsCreating(false);

        const errorMessage = TypeError(error).message;

        const toastMessage = errorMessage?.includes(
          'Cannot read properties of undefined'
        )
          ? 'User Canceled'
          : errorMessage;
        toast.error(toastMessage);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      });

    if (isNil(res?.metaid)) {
      toast.error('Create Failed');
    } else {
      // toast.success("Successfully created!Now you can connect your wallet again!");
      const success_modal = document.getElementById(
        'create_metaid_success_modal'
      ) as HTMLDialogElement;
      success_modal.showModal();
    }

    setIsCreating(false);
    console.log('your metaid', btcConnector.metaid);
    const doc_modal = document.getElementById(
      'create_metaid_modal'
    ) as HTMLDialogElement;
    doc_modal.close();
    await onWalletConnectStart();
  };

  return (
    <LoadingOverlay active={isCreating} spinner text='Creating MetaID...'>
      <CreateMetaIdInfoForm
        onSubmit={handleCreateMetaID}
        address={wallet?.address ?? ''}
        balance={balance}
      />
    </LoadingOverlay>
  );
};

export default CreateMetaIDFormWrap;
