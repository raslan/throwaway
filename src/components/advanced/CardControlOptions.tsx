import { capitalize } from '@/lib/utils';
import ReactCreditCard from 'react-credit-cards-2';
import useAdvancedMode, {
  advanced,
  AdvancedPropType,
} from 'src/hooks/useAdvancedMode';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import useIdentity from '@/hooks/useIdentity';

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

const PaymentProviderOptions = ({
  advanced,
  setAdvanced,
}: AdvancedPropType) => (
  <>
    <p className='m-0'>Payment Processor</p>
    <div className='grid grid-cols-5 rounded-xl bg-muted p-1'>
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
    <div className='grid grid-cols-2 rounded-xl bg-muted p-1'>
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
    <div className='grid grid-cols-5 rounded-xl bg-muted p-1'>
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

const CardControlOptions = () => {
  const { setAdvanced, ...advanced } = useAdvancedMode();
  const { identity } = useIdentity();
  return (
    <>
      <SwitchToggle
        label='Use Testing Cards'
        id='advanced-card-settings'
        description='Use QA Form Testing Cards from Different Providers'
        checked={advanced?.card}
        defaultChecked={advanced?.card}
        onCheckedChange={() =>
          setAdvanced({
            ...advanced,
            card: !advanced.card,
          })
        }
      />
      {advanced?.card && (
        <div className='flex items-center justify-between w-full gap-5'>
          <div className='flex flex-col justify-between gap-3 w-full'>
            <PaymentProviderOptions
              advanced={advanced}
              setAdvanced={setAdvanced}
            />
            <CardBrandOptions advanced={advanced} setAdvanced={setAdvanced} />
            <CardVariantOptions advanced={advanced} setAdvanced={setAdvanced} />
          </div>
          <div className='w-1/2'>
            <ReactCreditCard
              number={identity?.card_number}
              expiry={identity?.card_expiry}
              cvc={identity?.card_verification}
              name={`${advanced?.cardParams?.provider ?? ''} Test`}
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
