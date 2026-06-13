'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
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
            <div className="card-theme-wrapper" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-maroon)' }}>Contact Details</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📍 Shadi Mubarak Office, Bandra West, Mumbai, MH</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📞 Support Desk: +91 98765 43210 (10 AM - 6 PM)</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>✉️ Verification Dept: support@shadimubarak.in</p>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <span style={{ fontSize: '12.5px', color: 'var(--gold-accent)', fontWeight: 600 }}>We usually call back within 24 hours of submission.</span>
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
