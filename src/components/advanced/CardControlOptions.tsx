import SwitchToggle from '@/components/advanced/SwitchToggle';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { useEffect } from 'react';

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
      className='block cursor-pointer select-none border border-transparent px-2 py-2 text-center font-mono text-[10px] font-bold uppercase text-muted-foreground transition-colors duration-150 ease-in-out peer-checked:border-[var(--line)] peer-checked:bg-[#101217] peer-checked:text-[var(--digital-white)]'
    >
      {label}
    </label>
  </div>
);

const PaymentProviderOptions = () => {
  const { cardParams, setAdvanced } = useAdvancedMode();

  return (
    <>
      <p className='technical-label m-0'>Payment Processor</p>
      <div className='grid grid-cols-5 border border-[var(--line)] bg-[var(--control-panel-grey)] p-1'>
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
      <p className='technical-label m-0'>Card Issuer</p>
      <div className='grid grid-cols-2 border border-[var(--line)] bg-[var(--control-panel-grey)] p-1'>
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
      <p className='technical-label m-0'>Variant</p>
      <div className='grid grid-cols-5 border border-[var(--line)] bg-[var(--control-panel-grey)] p-1'>
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
        <div className='grid w-full grid-cols-[minmax(0,1fr)_260px] items-stretch gap-5'>
          <div className='flex min-w-0 flex-col justify-between gap-3'>
            <PaymentProviderOptions />
            <CardBrandOptions />
            <CardVariantOptions />
          </div>
          <div className='instrument-card min-h-[170px]'>
            <div className='instrument-card-label'>Testing card</div>
            <div className='instrument-card-number text-[20px]'>
              {identity?.card_number || '0000 0000 0000 0000'}
            </div>
            <div className='instrument-card-footer'>
              <span>{cardParams?.provider || 'provider'} test</span>
              <span>{cardParams?.brand || 'issuer'}</span>
              <span>{cardParams?.variant || 'variant'}</span>
            </div>
            <div className='instrument-card-footer'>
              <span>EXP {identity?.card_expiry || '00/00'}</span>
              <span>CVC {identity?.card_verification || '000'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardControlOptions;
