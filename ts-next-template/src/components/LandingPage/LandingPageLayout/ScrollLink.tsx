"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ScrollLinkProps } from '@/lib/types';

const ScrollLink = ({ to, id, children, className }: ScrollLinkProps) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const basePath = to.split('#')[0];
  const href = id ? `${to}#${id}` : to;
  
  useEffect(() => {
    if (!isClient) return;
    
    if (pathname === basePath && id) {
      if (window.location.hash === `#${id}`) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [pathname, basePath, id, isClient]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!isClient) return;
    
    if (pathname === basePath) {
      e.preventDefault();
      const element = document.getElementById(id!);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={className}
    >
      {children}
    </Link>
  );
};

export default ScrollLink;