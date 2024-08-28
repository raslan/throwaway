import SwitchToggle from '@/components/advanced/SwitchToggle';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { useEffect } from 'react';
import ReactCreditCard from 'react-credit-cards-2';

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
      className='peer sr-only'
      checked={isChecked}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className='block cursor-pointer text-base text-primary select-none rounded-xl p-2 text-center peer-checked:bg-primary peer-checked:font-bold peer-checked:text-primary-foreground duration-200 transition-all ease-in-out'
    >
      {label}
    </label>
  </div>
);

const PaymentProviderOptions = () => {
  const { cardParams, setAdvanced } = useAdvancedMode();

  return (
    <>
      <p className='m-0'>Payment Processor</p>
      <div className='grid grid-cols-5 rounded-xl bg-muted p-1'>
        {['stripe', 'paypal', 'amazon', 'fawrypay', 'paymob'].map(
          (provider) => (
            <OptionRadio
              key={provider}
              id={provider}
              label={provider.charAt(0).toUpperCase() + provider.slice(1)}
              isChecked={cardParams.provider === provider}
              onChange={() =>
                setAdvanced({
                  cardParams: {
                    ...cardParams,
                    provider: provider as any,
                  },
                })
              }
            />
          )
        )}
      </div>
    </>
  );
};

const CardBrandOptions = () => {
  const { cardParams, setAdvanced } = useAdvancedMode();

  return (
    <>
      <p className='m-0'>Card Issuer</p>
      <div className='grid grid-cols-2 rounded-xl bg-muted p-1'>
        {['visa', 'mastercard'].map((brand) => (
          <OptionRadio
            key={brand}
            id={brand}
            label={brand.toUpperCase()}
            isChecked={cardParams.brand === brand}
            onChange={() =>
              setAdvanced({
                cardParams: {
                  ...cardParams,
                  brand: brand as any,
                },
              })
            }
          />
        ))}
      </div>
    </>
  );
};

const CardVariantOptions = () => {
  const { cardParams, setAdvanced } = useAdvancedMode();

  return (
    <>
      <p className='m-0'>Variant</p>
      <div className='grid grid-cols-5 rounded-xl bg-muted p-1'>
        {['basic', 'debit', 'declined', 'expired', 'secure'].map((variant) => (
          <OptionRadio
            key={variant}
            id={variant}
            label={variant.charAt(0).toUpperCase() + variant.slice(1)}
            isChecked={cardParams.variant === variant}
            onChange={() =>
              setAdvanced({
                cardParams: {
                  ...cardParams,
                  variant: variant as any,
                },
              })
            }
          />
        ))}
      </div>
    </>
  );
};

const CardControlOptions = () => {
  const { advancedCardMode, cardParams, setAdvanced } = useAdvancedMode();
  const { identity, newIdentity } = useIdentity();

  useEffect(() => {
    if (advancedCardMode && !cardParams.provider) {
      setAdvanced({
        advancedCardMode: true,
        cardParams: {
          provider: 'stripe',
          brand: 'visa',
          variant: 'basic',
        },
      });
    }
  }, [cardParams, advancedCardMode, setAdvanced, newIdentity]);

  return (
    <>
      <SwitchToggle
        label='Use Testing Cards'
        id='advanced-card-settings'
        description='Use QA Form Testing Cards from Different Providers'
        checked={advancedCardMode}
        onCheckedChange={() =>
          setAdvanced({ advancedCardMode: !advancedCardMode })
        }
      />
      {advancedCardMode && (
        <div className='flex items-center justify-between w-full gap-5'>
          <div className='flex flex-col justify-between gap-3 w-full'>
            <PaymentProviderOptions />
            <CardBrandOptions />
            <CardVariantOptions />
          </div>
          <div className='w-1/2'>
            <ReactCreditCard
              number={identity?.card_number}
              expiry={identity?.card_expiry}
              cvc={identity?.card_verification}
              name={`${cardParams?.provider} Test`}
              issuer='elo'
              acceptedCards={['']}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CardControlOptions;
