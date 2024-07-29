import SwitchToggle from 'src/components/SwitchToggle';
import useAdvancedMode from 'src/hooks/useAdvancedMode';
import ReactCreditCard from 'react-credit-cards-2';
import useIdentity from 'src/hooks/useIdentity';
import { useEffect } from 'react';

const AdvancedMode = () => {
  const { setAdvanced, ...advanced } = useAdvancedMode();
  const { identity, newIdentity } = useIdentity();
  useEffect(() => {
    newIdentity(true);
  }, [
    advanced.cardParams.brand,
    advanced.cardParams.provider,
    advanced.cardParams.variant,
    advanced.card,
  ]);
  return (
    <div className='grid w-full p-6 px-12 pb-24 grid-cols-1 gap-4 overflow-scroll'>
      <SwitchToggle
        description={
          'Activate extra tuning features for cards (not all combinations are unique)'
        }
        defaultVal={advanced?.card}
        onToggle={() =>
          setAdvanced({
            ...advanced,
            card: !advanced?.card,
          })
        }
        label={'Use Advanced Card Mode'}
      />
      {advanced?.card && (
        <>
          <ReactCreditCard
            number={identity?.card_number}
            expiry={identity?.card_expiry}
            cvc={identity?.card_verification}
            name={identity?.name}
          />
          {/* PROVIDER */}
          <p className='m-0'>Payment Processor</p>
          <div className='grid grid-cols-5 space-x-1 rounded-xl bg-gray-800 p-1'>
            <div>
              <input
                type='radio'
                id='stripe'
                className='peer hidden'
                checked={advanced?.cardParams?.provider === 'stripe'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      provider: 'stripe',
                    },
                  })
                }
              />
              <label
                htmlFor='stripe'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Stripe
              </label>
            </div>
            <div>
              <input
                id='paypal'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.provider === 'paypal'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      provider: 'paypal',
                    },
                  })
                }
              />
              <label
                htmlFor='paypal'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                PayPal
              </label>
            </div>
            <div>
              <input
                type='radio'
                id='amazon'
                className='peer hidden'
                checked={advanced?.cardParams?.provider === 'amazon'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      provider: 'amazon',
                    },
                  })
                }
              />
              <label
                htmlFor='amazon'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Amazon
              </label>
            </div>
            <div>
              <input
                id='fawrypay'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.provider === 'fawrypay'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      provider: 'fawrypay',
                    },
                  })
                }
              />
              <label
                htmlFor='fawrypay'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Fawry
              </label>
            </div>
            <div>
              <input
                id='paymob'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.provider === 'paymob'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      provider: 'paymob',
                    },
                  })
                }
              />
              <label
                htmlFor='paymob'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                PayMob
              </label>
            </div>
          </div>
          {/* PROVIDER */}
          {/* BRAND */}
          <p className='m-0'>Card Issuer</p>
          <div className='grid grid-cols-2 space-x-1 rounded-xl bg-gray-800 p-1'>
            <div>
              <input
                type='radio'
                id='visa'
                className='peer hidden'
                checked={advanced?.cardParams?.brand === 'visa'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      brand: 'visa',
                    },
                  })
                }
              />
              <label
                htmlFor='visa'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                VISA
              </label>
            </div>
            <div>
              <input
                id='mastercard'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.brand === 'mastercard'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      brand: 'mastercard',
                    },
                  })
                }
              />
              <label
                htmlFor='mastercard'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                MasterCard
              </label>
            </div>
          </div>
          {/* BRAND */}
          {/* VARIANT */}
          <p className='m-0'>Variant</p>
          <div className='grid grid-cols-5 space-x-1 rounded-xl bg-gray-800 p-1'>
            <div>
              <input
                id='basic'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.variant === 'basic'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      variant: 'basic',
                    },
                  })
                }
              />
              <label
                htmlFor='basic'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Basic
              </label>
            </div>
            <div>
              <input
                id='debit'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.variant === 'debit'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      variant: 'debit',
                    },
                  })
                }
              />
              <label
                htmlFor='debit'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Debit
              </label>
            </div>
            <div>
              <input
                id='declined'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.variant === 'declined'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      variant: 'declined',
                    },
                  })
                }
              />
              <label
                htmlFor='declined'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Declined
              </label>
            </div>
            <div>
              <input
                id='expired'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.variant === 'expired'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      variant: 'expired',
                    },
                  })
                }
              />
              <label
                htmlFor='expired'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                Expired
              </label>
            </div>
            <div>
              <input
                id='secure'
                type='radio'
                className='peer hidden'
                checked={advanced?.cardParams?.variant === 'secure'}
                onChange={() =>
                  setAdvanced({
                    ...advanced,
                    cardParams: {
                      ...advanced.cardParams,
                      variant: 'secure',
                    },
                  })
                }
              />
              <label
                htmlFor='secure'
                className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-teal-700 peer-checked:font-bold peer-checked:text-white duration-200 transition-all ease-in-out'
              >
                3D Secure
              </label>
            </div>
          </div>
          {/* VARIANT */}
        </>
      )}
    </div>
  );
};

export default AdvancedMode;
