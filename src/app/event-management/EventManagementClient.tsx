'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import {
  SectionHeading,
  PremiumFooter,
} from '../../components/NikahComponents';
import { getSupportWhatsAppLink } from '../../lib/whatsapp';

const WA_EVENT_MSG =
  'Assalamu Alaikum, I am interested in Event Management support. Please share details for trusted wedding/event vendors.';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function DecoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="4" fill="var(--gold-accent)" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const x = 18 + 10 * Math.cos(r);
        const y = 18 + 10 * Math.sin(r);
        return (
          <ellipse
            key={deg}
            cx={x} cy={y} rx="3.5" ry="5.5"
            transform={`rotate(${deg + 90},${x},${y})`}
            fill="var(--rose-accent)"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

function VenueIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 32 L4 16 Q4 8 18 6 Q32 8 32 16 L32 32" />
      <rect x="13" y="22" width="10" height="10" />
      <circle cx="18" cy="14" r="2.5" fill="var(--gold-accent)" stroke="none" />
    </svg>
  );
}

function CateringIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="20" r="10" />
      <line x1="18" y1="10" x2="18" y2="6" />
      <path d="M13 7 Q13 12 18 12 Q23 12 23 7" />
      <line x1="28" y1="6" x2="28" y2="14" />
      <path d="M25 6 Q25 10 28 10" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="10" width="30" height="20" rx="3" />
      <circle cx="18" cy="20" r="6" />
      <circle cx="18" cy="20" r="3" fill="var(--gold-accent)" stroke="none" />
      <path d="M12 10 L14 6 L22 6 L24 10" />
      <circle cx="28" cy="14" r="1.5" fill="var(--gold-accent)" stroke="none" />
    </svg>
  );
}

function MakeupIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="4" width="8" height="14" rx="4" />
      <rect x="13" y="17" width="10" height="4" fill="var(--rose-accent)" stroke="none" />
      <rect x="14" y="20" width="8" height="12" rx="2" fill="var(--gold-accent)" fillOpacity="0.3" />
      <line x1="18" y1="20" x2="18" y2="32" strokeDasharray="2,2" />
    </svg>
  );
}

function MehendiIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 32 Q8 24 12 18 Q16 12 18 8 Q20 12 24 18 Q28 24 26 32" />
      <path d="M14 22 Q18 18 22 22" />
      <circle cx="18" cy="16" r="2" fill="var(--gold-accent)" stroke="none" />
      <path d="M12 28 Q18 25 24 28" />
    </svg>
  );
}

function InviteIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="28" height="20" rx="2" />
      <path d="M4 8 L18 20 L32 8" />
      <path d="M4 28 L13 19" />
      <path d="M32 28 L23 19" />
      <path d="M16 16 Q18 13 20 16 Q18 19 16 16 Z" fill="var(--rose-accent)" stroke="none" />
    </svg>
  );
}

function PlanningIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="6" width="20" height="24" rx="2" />
      <line x1="14" y1="6" x2="14" y2="2" />
      <line x1="22" y1="6" x2="22" y2="2" />
      <line x1="13" y1="16" x2="23" y2="16" />
      <line x1="13" y1="21" x2="20" y2="21" />
      <polyline points="10,11 12,13 16,9" strokeWidth="1.6" stroke="var(--gold-accent)" />
    </svg>
  );
}

function QaziIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4 Q12 7 16 8 Q12 9 14 12 Q18 10 22 12 Q24 9 20 8 Q24 7 22 4 Q18 6 14 4 Z" fill="var(--gold-accent)" fillOpacity="0.6" stroke="none" />
      <rect x="7" y="14" width="22" height="16" rx="2" />
      <line x1="18" y1="14" x2="18" y2="30" />
      <line x1="10" y1="20" x2="16" y2="20" />
      <line x1="20" y1="20" x2="26" y2="20" />
      <line x1="10" y1="25" x2="16" y2="25" />
      <line x1="20" y1="25" x2="26" y2="25" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--deep-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="4" width="8" height="16" rx="4" />
      <path d="M9 18 Q9 28 18 28 Q27 28 27 18" />
      <line x1="18" y1="28" x2="18" y2="33" />
      <line x1="12" y1="33" x2="24" y2="33" />
    </svg>
  );
}

// ─── Service Data ──────────────────────────────────────────────────────────

const EVENT_SERVICES = [
  { icon: <DecoIcon />,     name: 'Decoration Partners',        desc: 'Floral, thematic & stage décor for your special occasion' },
  { icon: <VenueIcon />,    name: 'Wedding Venues',             desc: 'Banquet halls, gardens & exclusive wedding event spaces' },
  { icon: <CateringIcon />, name: 'Catering Services',          desc: 'Authentic halal catering with diverse menu options' },
  { icon: <PhotoIcon />,    name: 'Photography & Videography',  desc: 'Professional wedding & event photography studios' },
  { icon: <MakeupIcon />,   name: 'Bridal Makeup',              desc: 'Expert bridal makeup artists for your perfect look' },
  { icon: <MehendiIcon />,  name: 'Mehendi Artists',            desc: 'Traditional and contemporary mehendi designs' },
  { icon: <InviteIcon />,   name: 'Invitation Cards',           desc: 'Premium digital & printed wedding invitations' },
  { icon: <PlanningIcon />, name: 'Wedding Planning',           desc: 'End-to-end wedding coordination & management' },
  { icon: <QaziIcon />,     name: 'Qazi & Nikah Arrangement',   desc: 'Trusted Qazi services for Nikah ceremonies' },
  { icon: <SoundIcon />,    name: 'Sound, Lighting & Stage',    desc: 'Professional sound, lighting & stage production' },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Share Your Requirement', desc: 'Tell us about your event — Nikah, Walima, engagement, or family function — along with date, location, and services needed.' },
  { step: '2', title: 'We Connect You with Vendors', desc: 'Our team shortlists trusted, verified vendors from our network who match your event type, budget, and location.' },
  { step: '3', title: 'Compare & Finalise', desc: 'Review vendor options, ask questions, and finalise the ones that best suit your family\'s vision and requirements.' },
  { step: '4', title: 'Enjoy a Smooth Event', desc: 'Relax as your trusted vendors handle their part. We stay available for any coordination support you may need.' },
];

const WHY_CHOOSE = [
  { icon: '✓', title: 'Trusted Vendor Network', desc: 'Every vendor partner is screened for reliability, halal compliance, and quality of service before being recommended.' },
  { icon: '✓', title: 'Family-Friendly Service', desc: 'We understand Islamic sensibilities. All event support is provided with modesty, respect, and family involvement in mind.' },
  { icon: '✓', title: 'Wedding-Focused Support', desc: 'Specialised in Nikah, Walima, engagement, and Muslim family events — not generic event management.' },
  { icon: '✓', title: 'Privacy & Professionalism', desc: 'Your event details and family information are kept strictly private and never shared without your explicit consent.' },
  { icon: '✓', title: 'Complete Occasion Coverage', desc: 'From Nikah and Walima to Aqeeqah, Khatna, and family functions — we assist with a wide range of occasions.' },
];

const EVENT_TYPES = ['Nikah', 'Walima', 'Engagement', 'Reception', 'Family Function', 'Other'];
const SERVICE_OPTIONS = ['Decoration', 'Venue', 'Catering', 'Photography', 'Makeup', 'Mehendi', 'Invitation Cards', 'Planning Support', 'Other'];

// ─── Main Component ────────────────────────────────────────────────────────

export default function EventManagementClient() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    eventType: '',
    eventDate: '',
    city: '',
    guestCount: '',
    message: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleService = (s: string) =>
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      setErrorMsg('Name and phone number are required.');
      return;
    }
    setSubmitStatus('submitting');
    setErrorMsg('');

    const services = selectedServices.length ? selectedServices.join(', ') : 'Not specified';
    const messageBody = [
      `Event Type: ${form.eventType || 'Not specified'}`,
      `Event Date: ${form.eventDate || 'Not specified'}`,
      `City/Location: ${form.city || 'Not specified'}`,
      `Guest Count: ${form.guestCount || 'Not specified'}`,
      `Required Services: ${services}`,
      form.message ? `Additional Notes: ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          city: form.city || undefined,
          inquiryType: 'Event Management',
          message: messageBody,
          sourcePage: '/event-management',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed. Please try again.');
      }
      setSubmitStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setSubmitStatus('error');
    }
  };

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--deep-maroon) 0%, #8c1d3c 60%, #501223 100%)',
            padding: '100px 0 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative gold circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(184,146,74,0.18)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(184,146,74,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '250px', height: '250px', borderRadius: '50%', border: '1px solid rgba(184,146,74,0.14)', pointerEvents: 'none' }} />

          <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <span
              className="script-accent"
              style={{ display: 'block', marginBottom: '12px', color: 'var(--gold-accent)', fontSize: '2rem' }}
            >
              Blessed Celebrations
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(32px, 6vw, 52px)',
                color: 'var(--warm-ivory)',
                fontWeight: 700,
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              Event Management
            </h1>
            <p
              style={{
                fontSize: 'clamp(14px, 2.5vw, 17px)',
                color: 'rgba(248,241,231,0.85)',
                maxWidth: '640px',
                margin: '0 auto 36px',
                lineHeight: 1.7,
              }}
            >
              From finding the right match to planning the perfect celebration — we help families connect with trusted, halal-compliant event service partners for every occasion.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="#inquiry-form"
                className="btn btn-gold"
                style={{ minWidth: '190px' }}
              >
                Get Event Support
              </a>
              <a
                href={getSupportWhatsAppLink(WA_EVENT_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  minWidth: '190px',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Decorative gold divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '52px' }}>
              <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold-accent))' }} />
              <span style={{ color: 'var(--gold-accent)', fontSize: '18px' }}>❀</span>
              <div style={{ width: '60px', height: '1px', background: 'linear-gradient(270deg, transparent, var(--gold-accent))' }} />
            </div>
          </div>
        </section>

        {/* ── Services Grid ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
          <div className="container">
            <SectionHeading
              title="Wedding & Event Services"
              subtitle="We help families connect with reliable, vetted partners across every category of wedding and event support."
              scriptText="Trusted Vendors"
            />

            <div
              className="event-services-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
              }}
            >
              {EVENT_SERVICES.map((svc) => (
                <div
                  key={svc.name}
                  className="event-service-card"
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '28px 20px 24px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-smooth)',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--soft-cream)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid var(--border-color)',
                    }}
                  >
                    {svc.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '16px',
                      color: 'var(--deep-maroon)',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {svc.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--warm-ivory)', padding: '80px 0' }}>
          <div className="container">
            <SectionHeading
              title="How It Works"
              subtitle="A simple four-step process to connect your family with the right event partners."
              scriptText="Our Process"
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '32px',
              }}
            >
              {HOW_IT_WORKS.map((item) => (
                <div
                  key={item.step}
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '32px 24px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'var(--maroon-gradient)',
                      color: 'var(--warm-ivory)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '22px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: 'var(--gold-glow-shadow)',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '17px',
                      color: 'var(--deep-maroon)',
                      fontWeight: 700,
                      marginBottom: '10px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--soft-cream)', padding: '80px 0' }}>
          <div className="container">
            <SectionHeading
              title="Why Choose Rishte Forever Events"
              subtitle="We combine our matrimonial expertise with trusted vendor relationships to provide families a seamless experience."
              scriptText="Our Promise"
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              {WHY_CHOOSE.map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '20px 22px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--deep-maroon)',
                      color: 'var(--warm-ivory)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '15.5px',
                        color: 'var(--deep-maroon)',
                        fontWeight: 700,
                        marginBottom: '4px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inquiry Form ──────────────────────────────────────────────── */}
        <section
          id="inquiry-form"
          style={{ backgroundColor: 'var(--warm-ivory)', padding: '80px 0' }}
        >
          <div className="container">
            <SectionHeading
              title="Plan Your Event"
              subtitle="Planning a Nikah, Walima, engagement, or family function? Share your requirements and we will connect you with trusted vendors."
              scriptText="Get in Touch"
            />

            <div
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                backgroundColor: 'var(--white)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--border-radius-xl)',
                padding: 'clamp(28px, 5vw, 52px)',
                boxShadow: 'var(--shadow-premium)',
                position: 'relative',
              }}
            >
                                                                      {submitStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '24px',
                      color: 'var(--deep-maroon)',
                      marginBottom: '12px',
                    }}
                  >
                    JazakAllahu Khayran!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
                    Your event inquiry has been received. Our team will contact you shortly with trusted vendor recommendations.
                  </p>
                  <a
                    href={getSupportWhatsAppLink(WA_EVENT_MSG)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold"
                  >
                    Also Chat on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your name"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Event Type</label>
                      <select
                        className="form-control"
                        value={form.eventType}
                        onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      >
                        <option value="">-- Select event type --</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Event Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">City / Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Delhi, Mumbai"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Approx. Guest Count</label>
                      <select
                        className="form-control"
                        value={form.guestCount}
                        onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                      >
                        <option value="">-- Select range --</option>
                        <option>Under 50</option>
                        <option>50 – 100</option>
                        <option>100 – 200</option>
                        <option>200 – 500</option>
                        <option>500+</option>
                      </select>
                    </div>
                  </div>

                  {/* Services checkboxes */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                      Required Services
                    </label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '8px',
                        padding: '14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        backgroundColor: 'var(--warm-ivory)',
                      }}
                    >
                      {SERVICE_OPTIONS.map((s) => (
                        <label
                          key={s}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(s)}
                            onChange={() => toggleService(s)}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Any special requirements, budget range, or other details..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  {errorMsg && (
                    <div
                      style={{
                        backgroundColor: 'rgba(111,29,53,0.08)',
                        color: 'var(--deep-maroon)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        border: '1px solid rgba(111,29,53,0.15)',
                      }}
                    >
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '14px',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-gold"
                      disabled={submitStatus === 'submitting'}
                      style={{ minWidth: '180px' }}
                    >
                      {submitStatus === 'submitting' ? 'Sending…' : 'Submit Inquiry'}
                    </button>
                    <a
                      href={getSupportWhatsAppLink(WA_EVENT_MSG)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        backgroundColor: '#25D366',
                        color: '#fff',
                        border: 'none',
                        minWidth: '180px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp Instead
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter onNavigate={handleNavigate as any} />
    </>
  );
}
