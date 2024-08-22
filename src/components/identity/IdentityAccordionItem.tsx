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
  indexProperty?: string;
}

export function IdentityAccordionItem({
  title,
  value,
  items,
  identity,
  indexProperty,
}: IdentityAccordionItemProps) {
  const [, copy] = useCopyToClipboard();

  return (
    <AccordionItem title={title} value={value}>
      <AccordionTrigger className='group'>
        <span>
          {title}{' '}
          <span className='text-primary/80 group-data-[state=closed]:hidden'>
            {indexProperty !== 'metadata'
              ? `(click any value to copy)`
              : `(read only)`}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className='grid grid-cols-2 gap-3 pr-2'>
          {items.map(({ key, label }) => {
            const value = indexProperty
              ? identity?.[indexProperty]?.[key as any]
              : identity?.[key];
            return (
              <Button
                variant={indexProperty !== 'metadata' ? 'outline' : 'ghost'}
                onClick={() => {
                  if (indexProperty !== 'metadata') {
                    copy(value);
                    toast.success(`Copied ${value}`);
                  }
                }}
                className='flex flex-col gap-2 text-left items-start py-8 border-primary/60'
                key={key}
              >
                <Label className='first-letter:uppercase font-normal text-primary/80'>
                  {label}
                </Label>
                <span className='font-bold text-base'>
                  {indexProperty
                    ? JSON.stringify(value)
                        .replace('{', '')
                        .replace('}', '')
                        .replaceAll('"', '')
                    : value}
                </span>
              </Button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
