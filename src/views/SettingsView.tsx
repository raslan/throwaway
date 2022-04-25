import { useState } from "react";
import Dropdown from "src/components/Dropdown";

const SettingsView = () => {
  const [settings, setSettings] = useState([
    {
      name: "Debug Mode",
      options: [true, false],
      value: false,
    },
    {
      name: "Theme",
      options: ["dark", "light"],
      value: false,
    },
  ]);
  return (
    <div className='flex flex-col gap-3 w-full p-8 px-12'>
      {settings.map((setting) => (
        <Dropdown
          setting={setting}
          setSelected={(value) => {
            const newSettings = [...settings];
            newSettings[newSettings.indexOf(setting)].value = value;
            setSettings(newSettings);
          }}
        />
      ))}
    </div>
  );
};

export default SettingsView;
