import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion } from '@/components/ui/accordion';
import { IdentityAccordionItem } from '@/components/identity/IdentityAccordionItem';
import useIdentity from 'src/hooks/useIdentity';

const categories = {
  personal: [
    { key: 'email', label: 'Email' },
    { key: 'avatar', label: 'Avatar' },
    { key: 'job_title', label: 'Job Title' },
    { key: 'name', label: 'Name' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'organization', label: 'Organization' },
    { key: 'username', label: 'Username' },
    { key: 'password', label: 'Password' },
  ],
  address: [
    { key: 'state', label: 'State' },
    { key: 'city', label: 'City' },
    { key: 'street', label: 'Street' },
    { key: 'zipcode', label: 'Zipcode' },
    { key: 'country', label: 'Country' },
    { key: 'suite', label: 'Suite' },
    { key: 'apartment', label: 'Apartment' },
  ],
  financial: [
    { key: 'currency', label: 'Currency' },
    { key: 'iban', label: 'IBAN' },
    { key: 'swift', label: 'SWIFT/BIC' },
    { key: 'account_number', label: 'Account Number' },
    { key: 'routing_number', label: 'Routing Number' },
  ],
};

export function IdentityDetails() {
  const { identity } = useIdentity();
  const extra = identity?.extra ? Object.keys(identity?.extra) : [];
  const metadata = identity?.metadata ? Object.keys(identity?.metadata) : [];
  return (
    <ScrollArea className='h-[80%] w-full mt-4 pb-4 pr-4'>
      <Accordion type='single' collapsible>
        {extra?.length > 0 && (
          <IdentityAccordionItem
            title='Custom Fields'
            value='custom fields'
            items={extra.map((key) => ({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
            }))}
            indexProperty={'extra'}
            identity={identity}
          />
        )}
        <IdentityAccordionItem
          title='Personal Information'
          value='personal-information'
          items={categories.personal}
          identity={identity}
        />
        <IdentityAccordionItem
          title='Address'
          value='address'
          items={categories.address}
          identity={identity}
        />
        <IdentityAccordionItem
          title='Financial'
          value='financial'
          items={categories.financial}
          identity={identity}
        />
        {metadata?.length > 0 && (
          <IdentityAccordionItem
            title='Metadata'
            value='metadata'
            items={metadata.map((key) => ({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
            }))}
            indexProperty={'metadata'}
            identity={identity}
          />
        )}
      </Accordion>
    </ScrollArea>
  );
}
