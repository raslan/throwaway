import useAdvancedMode from '@/hooks/useAdvancedMode';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

const sensitivityToNumber = {
  low: 50,
  medium: 75,
  high: 100,
};

const numberToSensitivity = {
  50: 'low',
  75: 'medium',
  100: 'high',
};

const SensitivityOptions = () => {
  const { controlSensitivity, sensitivity, setAdvanced } = useAdvancedMode();
  const [sliderValue, setSliderValue] = useState(
    sensitivityToNumber[sensitivity as 'low' | 'medium' | 'high']
  );

  useEffect(() => {
    if (controlSensitivity) {
      setAdvanced({
        controlSensitivity: true,
        sensitivity: numberToSensitivity[sliderValue as 50 | 75 | 100],
      });
    }
  }, [sliderValue, controlSensitivity, setAdvanced]);

  return (
    <>
      <SwitchToggle
        label='Control Autofill Sensitivity'
        id='advanced-autofill-settings'
        description='Pick the sensitivity of the autofill feature'
        checked={controlSensitivity}
        onCheckedChange={() =>
          setAdvanced({
            controlSensitivity: !controlSensitivity,
            sensitivity: controlSensitivity
              ? numberToSensitivity[sliderValue as 50 | 75 | 100]
              : 'medium',
          })
        }
      />
      {controlSensitivity && (
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
          <div>{sensitivity}</div>
        </div>
      )}
    </>
  );
};

export default SensitivityOptions;
