import SwitchToggle from 'src/components/SwitchToggle';
import useAdvancedMode, { advanced } from 'src/hooks/useAdvancedMode';
import ReactCreditCard from 'react-credit-cards-2';
import useIdentity from 'src/hooks/useIdentity';
import { useEffect } from 'react';

type AdvancedPropType = {
  advanced: advanced;
  setAdvanced: (val: advanced) => void;
};

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const PaymentProviderOptions = ({
  advanced,
  setAdvanced,
}: AdvancedPropType) => (
  <>
    <p className='m-0'>Payment Processor</p>
    <div className='grid grid-cols-5 space-x-1 rounded-xl bg-gray-800 p-1'>
      {['stripe', 'paypal', 'amazon', 'fawrypay', 'paymob'].map(
        (provider: any) => (
          <OptionRadio
            key={provider}
            id={provider}
            label={capitalize(provider)}
            isChecked={advanced?.cardParams?.provider === provider}
            onChange={() =>
              setAdvanced({
                ...advanced,
                cardParams: {
                  ...advanced.cardParams,
                  provider,
                },
              })
            }
          />
        )
      )}
    </div>
  </>
);

const CardBrandOptions = ({ advanced, setAdvanced }: AdvancedPropType) => (
  <>
    <p className='m-0'>Card Issuer</p>
    <div className='grid grid-cols-2 space-x-1 rounded-xl bg-gray-800 p-1'>
      {['visa', 'mastercard'].map((brand: any) => (
        <OptionRadio
          key={brand}
          id={brand}
          label={brand.toUpperCase()}
          isChecked={advanced?.cardParams?.brand === brand}
          onChange={() =>
            setAdvanced({
              ...advanced,
              cardParams: {
                ...advanced.cardParams,
                brand,
              },
            })
          }
        />
      ))}
    </div>
  </>
);

const CardVariantOptions = ({ advanced, setAdvanced }: AdvancedPropType) => (
  <>
    <p className='m-0'>Variant</p>
    <div className='grid grid-cols-5 space-x-1 rounded-xl bg-gray-800 p-1'>
      {['basic', 'debit', 'declined', 'expired', 'secure'].map(
        (variant: any) => (
          <OptionRadio
            key={variant}
            id={variant}
            label={capitalize(variant)}
            isChecked={advanced?.cardParams?.variant === variant}
            onChange={() =>
              setAdvanced({
                ...advanced,
                cardParams: {
                  ...advanced.cardParams,
                  variant,
                },
              })
            }
          />
        )
      )}
    </div>
  </>
);

const OptionRadio = ({
  id,
  label,
  isChecked,
  onChange,
}: {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: () => void;
}) => (
  <div>
    <input
      type='radio'
      id={id}
      className='peer hidden'
      checked={isChecked}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className='block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-gray-300 peer-checked:font-bold peer-checked:text-black duration-200 transition-all ease-in-out'
    >
      {label}
    </label>
  </div>
);

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
    <div className='grid w-full max-h-[83%] p-6 px-12 pb-24 grid-cols-1 gap-4 overflow-scroll'>
      <SwitchToggle
        description='Activate extra tuning features for cards (not all combinations are unique)'
        defaultVal={advanced?.card}
        onToggle={() =>
          setAdvanced({
            ...advanced,
            card: !advanced?.card,
          })
        }
        label='Use Advanced Card Mode'
      />
      {advanced?.card && (
        <>
          <ReactCreditCard
            number={identity?.card_number}
            expiry={identity?.card_expiry}
            cvc={identity?.card_verification}
            name={identity?.name}
          />
          <PaymentProviderOptions
            advanced={advanced}
            setAdvanced={setAdvanced}
          />
          <CardBrandOptions advanced={advanced} setAdvanced={setAdvanced} />
          <CardVariantOptions advanced={advanced} setAdvanced={setAdvanced} />
        </>
      )}
    </div>
  );
};

export default AdvancedMode;
