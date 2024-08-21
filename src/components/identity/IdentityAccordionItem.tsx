import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

interface IdentityAccordionItemProps {
  title: string;
  value: string;
  items: { key: string; label: string }[];
  identity: Record<string, string>;
}

export function IdentityAccordionItem({
  title,
  value,
  items,
  identity,
}: IdentityAccordionItemProps) {
  const [, copy] = useCopyToClipboard();

  return (
    <AccordionItem title={title} value={value}>
      <AccordionTrigger className='group'>
        <span>
          {title}{' '}
          <span className='text-primary/80 group-data-[state=closed]:hidden'>
            (click any value to copy)
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className='grid grid-cols-2 gap-3 pr-2'>
          {items.map(({ key, label }) => (
            <Button
              variant='outline'
              onClick={() => {
                copy(identity?.[key]);
                toast.success(`Copied ${identity?.[key]}`);
              }}
              className='flex flex-col gap-2 text-left items-start py-8 border-primary/60'
              key={key}
            >
              <Label className='first-letter:uppercase font-normal text-primary/80'>
                {label}
              </Label>
              <span className='font-bold text-base'>{identity?.[key]}</span>
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
