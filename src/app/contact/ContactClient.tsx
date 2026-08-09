'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';
import LeadForm from '../../components/LeadForm';
import { BusinessLocation, defaultBusinessLocation } from '../../lib/businessLocation';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';
import { SUPPORT_EMAIL } from '@/lib/faqData';

export default function ContactClient() {
  const router = useRouter();
  const [location, setLocation] = useState<BusinessLocation>(defaultBusinessLocation);

  useEffect(() => {
    fetch('/api/business-location')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setLocation(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load business location:', err);
      });
  }, []);

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Contact Customer Support"
            subtitle="Have questions about verification or payment? Drop us a message."
            scriptText="Get in Touch"
            as="h1"
          />

          <div className="contact-layout">
            <div className="contact-card">
              <div style={{ position: 'relative', height: '160px' }}>
                <Image src="/images/nikah-1.jpeg" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} alt="Contact Rishte Forever" />
              </div>
              <div className="contact-card-body">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)' }}>Contact Details</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📍 {location.address}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  📞 Call us: <a href={`tel:${location.phoneRaw}`} style={{ color: 'var(--deep-maroon)', fontWeight: 'bold', textDecoration: 'underline' }}>{location.phone}</a> (10 AM - 6 PM)
                </p>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span>💬 WhatsApp: <strong style={{ color: 'var(--deep-maroon)' }}>+91 96754 83125</strong></span>
                  <a
                    href={getSupportWhatsAppLink('Assalamu Alaikum, I need support regarding Rishte Forever.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>✉️ Verification Dept: {SUPPORT_EMAIL}</p>

                {(location.facebookUrl || location.instagramUrl || location.youtubeUrl || location.linkedinUrl || location.twitterUrl) && (
                  <>
                    <hr style={{ borderColor: 'var(--border-color)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--deep-maroon)', fontWeight: 600 }}>Follow Us</h4>
                      <div className="social-links">
                        {location.facebookUrl && (
                          <a href={location.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-social" aria-label="Facebook">Facebook</a>
                        )}
                        {location.instagramUrl && (
                          <a href={location.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-social" aria-label="Instagram">Instagram</a>
                        )}
                        {location.youtubeUrl && (
                          <a href={location.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-social" aria-label="YouTube">YouTube</a>
                        )}
                        {location.linkedinUrl && (
                          <a href={location.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-social" aria-label="LinkedIn">LinkedIn</a>
                        )}
                        {location.twitterUrl && (
                          <a href={location.twitterUrl} target="_blank" rel="noopener noreferrer" className="btn btn-social" aria-label="X / Twitter">X / Twitter</a>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <hr style={{ borderColor: 'var(--border-color)' }} />
                <span style={{ fontSize: '12.5px', color: 'var(--gold-accent)', fontWeight: 600 }}>We usually call back within 24 hours of submission.</span>
              </div>
            </div>

            <div className="contact-form-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>Send Support Message</h3>
              <LeadForm defaultInquiryType="General Inquiry" />
            </div>
          </div>
        </div>
      </main>

      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
