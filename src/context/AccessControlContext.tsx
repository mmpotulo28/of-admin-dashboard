'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@stackframe/stack';

export enum iTeamId {
  user = '28f5750a-d3f2-4f12-8548-778e85db13e1',
  organizer = 'cd74a509-ca0c-4d7a-b896-141eda9d621d',
  admin = '6731c9da-9d38-467c-b5cd-bfa73f378156',
}

interface iAccessControlContextProps {
  isAdmin: boolean;
  isOrganizer: boolean;
  isUser: boolean;
}

const AccessControlContext = createContext<iAccessControlContextProps | null>(
  null
);

export const AccessControlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUser({ or: 'redirect' });
  const teams = user.useTeams();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = teams.some((team) => team.id === iTeamId.admin);
  const isOrganizer = teams.some((team) => team.id === iTeamId.organizer);
  const isUser = teams.some((team) => team.id === iTeamId.user);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Redirect based on access control
    if (!isAdmin && pathname?.startsWith('/')) {
      router.push('/public/unauthorized');
    }
  }, [pathname, router, isAdmin, isOrganizer]);

  return (
    <AccessControlContext.Provider value={{ isAdmin, isOrganizer, isUser }}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error(
      'useAccessControl must be used within an AccessControlProvider'
    );
  }
  return context;
};
