import LoadingOverlay from 'react-loading-overlay-ts';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../store/user';
import EditMetaIdInfoForm from './EditMetaIdInfoForm';
import { useQueryClient } from '@tanstack/react-query';

export type MetaidUserInfo = {
  name: string;
  bio?: string;
  avatar?: string;
};

type Iprops = {
  btcConnector: BtcConnector;
};

const EditMetaIDFormWrap = ({ btcConnector }: Iprops) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const queryClient = useQueryClient();
  console.log('userInfo', userInfo);
  const handleEditMetaID = async (userInfo: MetaidUserInfo) => {
    setIsEditing(true);
    try {
      const res = await btcConnector.updatUserInfo({ ...userInfo });
      if (res) {
        console.log('after create', await btcConnector.getUser());
        setUserInfo(await btcConnector.getUser());
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        toast.success('Updating Your Profile Successfully!');
      }
    } catch (error) {
      console.log('update user error ', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.message);
    }

    const doc_modal = document.getElementById(
      'edit_metaid_modal'
    ) as HTMLDialogElement;
    doc_modal.close();
  };

  return (
    <LoadingOverlay
      active={isEditing}
      spinner
      text='Your Profile is Being Updating...'
    >
      <EditMetaIdInfoForm
        onSubmit={handleEditMetaID}
        initialValues={{ name: userInfo?.name, bio: userInfo?.bio }}
      />
    </LoadingOverlay>
  );
};

export default EditMetaIDFormWrap;
