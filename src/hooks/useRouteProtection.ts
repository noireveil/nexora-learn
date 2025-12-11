import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/db/schema';

export const useRouteProtection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await db.users.orderBy('lastLogin').last();
      
      if (!user) {
        if (pathname !== '/' && pathname !== '/onboarding') {
            router.replace('/');
        }
        return;
      }

      if (!user.startingLevel) {
         if (pathname !== '/onboarding') {
             router.replace('/onboarding');
         }
         return;
      }

      setIsAuthorized(true);
    };

    checkUser();
  }, [router, pathname]);

  return isAuthorized;
};