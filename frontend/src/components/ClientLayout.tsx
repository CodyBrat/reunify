'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  const showSidebar = !isAuthPage;

  return (
    <>
      <Navigation />
      <main id="main-content" className={showSidebar ? 'with-sidebar' : ''}>
        {children}
      </main>
    </>
  );
}
