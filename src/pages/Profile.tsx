// import { useQuery } from '@tanstack/react-query';
// import { useParams } from 'react-router-dom';
// import { getPinDetailByPid } from '../api/buzz';
import BackButton from '../components/Buttons/BackButton';
// import BuzzCard from '../components/BuzzList/BuzzCard';

const Profile = () => {
  // const { id: address } = useParams();
  // const userAddress = address ?? '';

  // const { isLoading, data: buzzDetailData } = useQuery({
  //   queryKey: ['userinfo', id],
  //   queryFn: () => getPinDetailByPid({ pid: id! }),
  // });

  return (
    <div>
      <BackButton />
      {/* <div>Profile </div>
      <div className='mt-6'>
        {isLoading ? (
          <div className='grid place-items-center h-[200px]'>
            <span className='loading loading-ring loading-lg grid text-white'></span>
          </div>
        ) : (
          <BuzzCard buzzItem={buzzDetailData} />
        )}
      </div> */}
    </div>
  );
};

export default Profile;
