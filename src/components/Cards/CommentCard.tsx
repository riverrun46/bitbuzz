import { LucideLink } from 'lucide-react'
import CustomAvatar from '../Public/CustomAvatar'
import dayjs from '../../utils/dayjsConfig'
import { IBtcConnector } from '@metaid/metaid'
import { CommentRes } from '../../api/buzz'
import { environment } from '../../utils/environments'
import { isNil } from 'ramda'
import { useQuery } from '@tanstack/react-query'
import { Connector } from '../../types'

type Iprops = {
  commentRes: CommentRes
  connector: Connector
}

const CommentCard = ({ commentRes, connector }: Iprops) => {
  const currentUserInfoData = useQuery({
    enabled: !isNil(commentRes?.pinAddress),
    queryKey: ['userInfo', commentRes?.pinAddress, environment.network],
    queryFn: () =>
      connector?.getUser({
        network: environment.network,
        currentAddress: commentRes?.pinAddress,
      }),
  })

  return (
    <>
      <div className='flex gap-2.5'>
        <CustomAvatar size='36px' />
        <div className='flex flex-col gap-2 mt-2 w-full'>
          <div>{currentUserInfoData?.data?.name ?? 'MetaID-User'}</div>
          <div>{commentRes.content}</div>
          <div className='flex justify-between text-gray text-xs mt-2'>
            <div className=' flex gap-2'>
              <div className='flex gap-1 items-center hover:text-slate-300 cursor-pointer'>
                <LucideLink size={12} />
                <div>{(commentRes?.pinId ?? '').slice(0, 8) + '...'}</div>
              </div>
              <div>
                {dayjs
                  .unix(dayjs().unix())
                  .tz(dayjs.tz.guess())
                  .format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommentCard
