import { CheckCheck } from 'lucide-react';
type Iprops = {
  handleFollow: (isFollowed: boolean) => void;
  isFollowed?: boolean;
};
const FollowButton = ({ isFollowed, handleFollow }: Iprops) => {
  return (
    <div onClick={() => handleFollow(isFollowed ?? false)}>
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
