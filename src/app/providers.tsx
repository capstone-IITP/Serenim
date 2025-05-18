'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import CosmicLoader from './components/CosmicLoader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export default function Providers({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Track initial app load
  useEffect(() => {
    // Let the CosmicLoader handle the loading state during initial load
    // Just mark that we've done the initial load once it completes
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);
  
  // Handle route changes
  useEffect(() => {
    // Only trigger loading on actual route changes, not initial load
    // Skip the first render (initial load) which is handled separately
    if (!isInitialLoad && pathname) {
      setIsLoading(true);
      
      // For route changes, we can use a shorter timeout
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, isInitialLoad]);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <CosmicLoader />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}