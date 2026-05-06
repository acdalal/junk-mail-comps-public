import { useEffect, useState } from 'react';
import { useTheme } from '@/context/themeContext';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme } = useTheme();

  useEffect(() => { setHasHydrated(true); }, []);

  return hasHydrated ? colorScheme : 'light';
}
