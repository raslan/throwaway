import { advanced } from '@/hooks/useAdvancedMode';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

const sensitivityToNumber = {
  50: 'low',
  75: 'medium',
  100: 'high',
};

const numberToSensitivity = {
  low: 50,
  medium: 75,
  high: 100,
};

const SensitivityOptions = ({
  advanced,
  setAdvanced,
}: {
  advanced: advanced;
  setAdvanced: (val: advanced) => void;
}) => {
  const [sliderValue, setSliderValue] = useState(
    numberToSensitivity[advanced.sensitivity as 'low' | 'medium' | 'high']
  );
  useEffect(() => {
    if (advanced.controlSensitivity) {
      setAdvanced({
        ...advanced,
        sensitivity: sensitivityToNumber[sliderValue as 50 | 75 | 100],
      });
    }
  }, [sliderValue]);
  return (
    <>
      <SwitchToggle
        label='Control Autofill Sensitivity'
        id='advanced-autofill-settings'
        description='Pick the sensitivity of the autofill feature'
        checked={advanced?.controlSensitivity}
        defaultChecked={advanced?.controlSensitivity}
        onCheckedChange={() =>
          setAdvanced({
            ...advanced,
            controlSensitivity: !advanced.controlSensitivity,
          })
        }
      />
      {advanced?.controlSensitivity && (
        <div className='flex items-center justify-between w-full gap-5'>
          <div className='flex flex-col justify-between gap-3 w-full'>
            <Label>Autofill Sensitivity</Label>
            <Slider
              value={[sliderValue]}
              onValueChange={(val) => setSliderValue(val[0])}
              min={50}
              max={100}
              step={25}
            />
          </div>
          {advanced?.sensitivity}
        </div>
      )}
    </>
  );
};

export default SensitivityOptions;
