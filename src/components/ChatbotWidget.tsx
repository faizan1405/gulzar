'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const ChatbotWindow = dynamic(() => import('./ChatbotWindow'), { ssr: false });

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Allow other parts of the site (e.g. the FAQ page "Ask the Assistant"
  // button) to open the chatbot by dispatching a global event.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('rf-open-chatbot', open);
    return () => window.removeEventListener('rf-open-chatbot', open);
  }, []);

  // Do not render the chatbot on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="chatbot-widget-container font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-trigger"
          title="Ask Rishte Forever"
          aria-label="Open matrimonial support assistant"
        >
          <div className="chatbot-trigger-icon">
            ❀
          </div>
          <span className="chatbot-trigger-text">Ask Rishte Forever</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <ChatbotWindow onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
