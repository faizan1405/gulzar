'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { getSupportWhatsAppLink } from '../lib/whatsapp';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide the WhatsApp button on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const message = 'Assalamu Alaikum, I want to know more about Rishte Forever.';
  const link = getSupportWhatsAppLink(message);

  return (
    <div className="whatsapp-button-container font-sans">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button-trigger"
        aria-label="Chat on WhatsApp with Rishte Forever support"
      >
        <svg
          className="whatsapp-button-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M12.012 2c-5.506 0-9.97 4.478-9.97 10.012 0 1.77.458 3.43 1.258 4.887L2 22l5.253-1.378c1.402.766 3 1.2 4.759 1.2 5.506 0 9.97-4.478 9.97-10.012 0-5.534-4.464-10.012-9.97-10.012zm5.795 13.91c-.244.694-1.22 1.268-1.745 1.355-.472.079-.938.293-3.04-.542-2.527-.998-4.14-3.565-4.267-3.731-.127-.166-.991-1.32-.991-2.518 0-1.2.626-1.79.847-2.029.221-.24.479-.3.639-.3a.46.46 0 0 1 .332.155c.105.155.434 1.058.471 1.139.037.081.062.176.009.282-.053.106-.079.171-.157.262-.078.09-.166.2-.236.269-.079.078-.162.162-.07.32.092.158.411.678.88 1.096.604.538 1.111.704 1.267.782.157.078.249.066.342-.04.093-.106.402-.469.511-.627.109-.158.217-.132.366-.077.148.055.942.443 1.103.524.161.081.268.121.308.19.04.069.04.4-.204 1.094z" />
        </svg>
        <span className="whatsapp-button-text">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
