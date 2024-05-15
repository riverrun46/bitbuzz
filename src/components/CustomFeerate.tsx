import React from 'react';
import cls from 'classnames';

type IProps = {
  // onSubmit: (buzz: { content: string; images: AttachmentItem[] }) => void;

  feeRateOptions: {
    name: string;
    number: number;
  }[];
  selectFeeRate: {
    name: string;
    number: number;
  };
  setSelectFeeRate: React.Dispatch<
    React.SetStateAction<{
      name: string;
      number: number;
    }>
  >;
  handleCustomFeeChange: (v: string) => void;
  customFee: string;
};

const CustomFeerate = ({
  feeRateOptions,
  selectFeeRate,
  setSelectFeeRate,
  handleCustomFeeChange,
  customFee,
}: IProps) => {
  return (
    <div className='grid grid-cols-4 gap-2'>
      {feeRateOptions.map((d) => {
        return (
          <div
            onClick={() => setSelectFeeRate(d)}
            key={d.name}
            className={cls(
              'shadow shadow-gray rounded-md p-2 cursor-pointer  bg-[#191C20]  hover:bg-gray/40  hover:border-main',
              {
                'bg-gray/40 border  border-main': d.name === selectFeeRate.name,
              }
            )}
          >
            <div className='flex flex-col items-center gap-2'>
              <div className='text-white'>{d.name}</div>
              <div className='flex items-center gap-1'>
                {d.name === 'Custom' ? (
                  <input
                    inputMode='numeric'
                    type='number'
                    min={0}
                    max={'100000'}
                    style={{
                      appearance: 'textfield',
                    }}
                    aria-hidden
                    className='w-[50px] input input-xs  bg-gray/40  shadow-inner !pr-0 border-none focus:border-main text-main focus:outline-none'
                    step={1}
                    value={customFee}
                    onChange={(e) => {
                      const v = e.currentTarget.value;
                      handleCustomFeeChange(v);
                      setSelectFeeRate({ ...d, number: Number(v) });
                    }}
                  />
                ) : (
                  <div className='text-sm text-main'>{d.number}</div>
                )}
                <div className='text-gray text-xs'>sats/vB</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomFeerate;
