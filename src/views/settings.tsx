import SwitchToggle from 'src/components/SwitchToggle';
import useSettings, { Settings } from 'src/hooks/useSettings';
import { getSettingDescription, getSettingName } from 'src/lib/utils';

const Settings = () => {
  const { setSettings, ...settings } = useSettings();
  return (
    <div className='grid w-full p-6 pb-24 grid-cols-2 gap-8 overflow-scroll'>
      {Object?.keys?.(settings)?.map((setting, index) => (
        <SwitchToggle
          description={getSettingDescription(setting as keyof Settings)}
          key={index}
          defaultVal={settings?.[setting as keyof typeof settings]}
          onToggle={() =>
            setSettings({
              ...settings,
              [setting]: !settings?.[setting as keyof typeof settings],
            })
          }
          label={getSettingName(setting as keyof Settings)}
        />
      ))}
    </div>
  );
};

export default Settings;
