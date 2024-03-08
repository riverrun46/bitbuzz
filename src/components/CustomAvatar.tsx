import { UserInfo } from '../store/user';
import { isEmpty, isNil } from 'ramda';

const CustomAvatar = ({ userInfo }: { userInfo: UserInfo }) => {
  const hasUser = !isNil(userInfo?.name) && !isEmpty(userInfo?.name);
  const userAlt = hasUser
    ? userInfo.name.slice(0, 4)
    : userInfo!.address.slice(-4, -2);
  const src = `https://man-test.metaid.io${userInfo?.avatar ?? ''}`;
  return hasUser ? (
    <img
      src={src}
      alt='user avatar'
      className='rounded-full self-start'
      width={45}
      height={45}
    />
  ) : (
    <div className='avatar placeholder'>
      <div className='bg-[#2B3440] text-[#D7DDE4] rounded-full w-12'>
        <span>{userAlt}</span>
      </div>
    </div>
  );
};

export default CustomAvatar;
