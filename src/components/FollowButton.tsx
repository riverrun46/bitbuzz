import { CheckCheck } from 'lucide-react';
type Iprops = {
  isFollowed?: boolean;
};
const FollowButton = ({ isFollowed }: Iprops) => {
  return (
    <div>
      {isFollowed ? (
        <div className='btn btn-ghost btn-sm text-gray '>
          <CheckCheck /> Followed
        </div>
      ) : (
        <div className='btn btn-outline btn-sm btn-primary rounded-full w-[90px]'>
          Follow
        </div>
      )}
    </div>
  );
};

export default FollowButton;
