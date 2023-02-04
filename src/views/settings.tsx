import SwitchToggle from 'src/components/SwitchToggle';
import useSettings, { Settings } from 'src/hooks/useSettings';
import { getSettingDescription, getSettingName } from 'src/lib/utils';

const Settings = () => {
  const { setSettings, ...settings } = useSettings();
  return (
    <div className='grid w-full p-6 px-12 pb-24 grid-cols-1 gap-8 overflow-scroll'>
      {Object?.keys?.(settings)?.map((setting, index) => {
        if (typeof settings?.[setting as keyof typeof settings] !== 'string')
          return (
            <SwitchToggle
              description={getSettingDescription(setting as keyof Settings)}
              key={index}
              defaultVal={
                settings?.[setting as keyof typeof settings] as boolean
              }
              onToggle={() =>
                setSettings({
                  ...settings,
                  [setting]: !settings?.[setting as keyof typeof settings],
                })
              }
              label={getSettingName(setting as keyof Settings)}
            />
          );
        return (
          <div className='flex flex-col gap-2 justify-center w-full'>
            <div>
              <div className='flex justify-between items-center pr-3 mb-2'>
                <label className='font-bold text-sm'>
                  {getSettingName(setting as keyof Settings)}
                </label>
                <input
                  className='bg-transparent border border-teal-600 p-1 w-3/5 font-bold text-center text-teal-300'
                  value={settings?.[setting as keyof typeof Settings]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [setting]: e.target.value,
                    })
                  }
                />
              </div>
              <span className='text-xs text-gray-300'>
                {getSettingDescription(setting as keyof Settings)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Settings;
