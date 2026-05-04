import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Inbox as InboxIcon, SlidersHorizontal, UserRound } from 'lucide-react';

const options = [
  {
    label: 'Identity',
    icon: UserRound,
    path: 'identity',
  },
  {
    label: 'Email',
    icon: InboxIcon,
    path: 'email',
  },
  {
    label: 'Profiles',
    icon: Fingerprint,
    path: 'profiles',
  },
  {
    label: 'Config',
    icon: SlidersHorizontal,
    path: 'advanced',
  },
];

const views = options.map((option) => option.path);

const Navigation = () => {
  const [view, setView] = useLocalStorage('throwaway-view', 'email');
  useEffect(() => {
    if (!view || !views?.includes?.(view)) setView('email');
  }, [view]);

  return (
    <Tabs
      defaultValue='email'
      value={view}
      onValueChange={(value) => setView(value)}
    >
      <TabsList className='navigation-shell fixed bottom-0 left-0 w-full'>
        {options.map((option) => (
          <TabsTrigger
            key={option.label}
            value={option.path}
            className='navigation-trigger'
          >
            <option.icon className='h-4 w-4' strokeWidth={1.6} />
            <span>{option.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default Navigation;
