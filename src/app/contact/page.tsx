'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { SectionHeading, FloralCorner, PremiumFooter } from '../../components/NikahComponents';

export default function ContactPage() {
  const router = useRouter();

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
          />

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card-theme-wrapper" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '160px' }}>
                <Image src="/images/nikah-1.jpeg" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} alt="Contact Shadi Mubarak" />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)' }}>Contact Details</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📍 Shadi Mubarak Office, Bandra West, Mumbai, MH</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  📞 Call us: <a href="tel:+919557006617" style={{ color: 'var(--deep-maroon)', fontWeight: 'bold', textDecoration: 'underline' }}>+91 95570 06617</a> (10 AM - 6 PM)
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>✉️ Verification Dept: support@shadimubarak.in</p>
                <hr style={{ borderColor: 'var(--border-color)' }} />
                <span style={{ fontSize: '12.5px', color: 'var(--gold-accent)', fontWeight: 600 }}>We usually call back within 24 hours of submission.</span>
              </div>
            </div>

            <div className="card-theme-wrapper" style={{ gridColumn: 'span 2', padding: '32px' }}>
              <FloralCorner position="tl" color="var(--gold-accent)" />
              <FloralCorner position="tr" color="var(--gold-accent)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)', marginBottom: '16px' }}>Send Support Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Alhamdulillah! Message received. We will get back shortly.'); }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Registered Phone Number</label>
                  <input type="tel" className="form-control" placeholder="e.g. +91 9999999999" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message details</label>
                  <textarea className="form-control" rows={4} placeholder="Describe your query..." required />
                </div>
                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
