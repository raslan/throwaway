import SubLabel from '@/components/advanced/SubLabel';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SwitchToggle = ({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  id,
}: any) => (
  <div className='flex w-full items-center justify-between'>
    <div className='flex flex-col gap-1'>
      <Label htmlFor={id} className='text-lg'>
        {label}
      </Label>
      <SubLabel>{description}</SubLabel>
    </div>
    <Switch
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
    />
  </div>
);

export default SwitchToggle;
