'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

interface ContactButtonProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export default function ContactButton({ className, children = 'Contato', title = 'Abrir formulário de contato' }: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title={title}
        className={className}
      >
        {children}
      </button>
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}