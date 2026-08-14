'use client';

import { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';

interface TrackedWhatsAppLinkProps {
  href: string;
  source: string;
  className?: string;
  children: ReactNode;
}

export default function TrackedWhatsAppLink({ href, source, className, children }: TrackedWhatsAppLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackEvent('whatsapp_click', { source })}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
