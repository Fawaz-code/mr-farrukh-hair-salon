import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { FloatingElements } from './FloatingElements';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative selection:bg-primary selection:text-white bg-background overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <FloatingElements />
      <Footer />
    </div>
  );
}