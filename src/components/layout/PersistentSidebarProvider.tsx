
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getSidebarStateFromCookie, setSidebarStateCookie } from '@/lib/cookie-utils';

interface PersistentSidebarProviderProps {
  children: React.ReactNode;
}

export function PersistentSidebarProvider({ children }: PersistentSidebarProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    // Read the cookie state on mount
    const savedState = getSidebarStateFromCookie();
    setDefaultOpen(savedState);
    setIsInitialized(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setSidebarStateCookie(open);
  };

  // Don't render until we've read the cookie to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <SidebarProvider 
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
    >
      {children}
    </SidebarProvider>
  );
}
