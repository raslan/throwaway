import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
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
    <AccordionItem title={title} value={value} className='identity-section'>
      <AccordionTrigger className='group px-1 hover:no-underline'>
        <span className='technical-label text-white'>
          {title}
          <span className='section-hint group-data-[state=closed]:hidden'>
            {indexProperty !== 'metadata'
              ? `(click any value to copy)`
              : `(read only)`}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className='identity-field-grid'>
          {items.map(({ key, label }) => {
            const fieldValue = indexProperty
              ? identity?.[indexProperty]?.[key as any]
              : identity?.[key];
            const displayValue = fieldValue
              ? indexProperty
                ? JSON.stringify(fieldValue)
                    .replace('{', '')
                    .replace('}', '')
                    .replaceAll('"', '')
                : fieldValue
              : '[empty]';

            return (
              <button
                type='button'
                onClick={() => {
                  if (indexProperty !== 'metadata' && fieldValue) {
                    copy(String(fieldValue));
                    toast.success(`Copied ${fieldValue}`);
                  }
                }}
                className='identity-field'
                key={key}
                title={fieldValue ? String(fieldValue) : undefined}
              >
                <span className='identity-field-label'>{label}</span>
                <span className='identity-field-value'>{displayValue}</span>
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
