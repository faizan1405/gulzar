'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { SectionHeading, SuccessStoryCard, PremiumFooter } from '../../components/NikahComponents';

export default function SuccessStoriesClient() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow" style={{ position: 'relative' }}>
        {/* Background Image Layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <Image
             src="/images/nikah-4.jpeg"
             alt="Success Stories Nikah"
             fill
             style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(253, 248, 245, 0.85), rgba(253, 248, 245, 0.95))'
          }} />
        </div>

        <div className="container font-sans" style={{ padding: '60px 0 80px 0', position: 'relative', zIndex: 1 }}>
          <SectionHeading
            title="Blessed Success Stories"
            subtitle="Alhamdulillah! Read inspiring stories of marriage from blessed couples."
            scriptText="Nikah Testimonials"
            as="h1"
          />

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <SuccessStoryCard
              names="Dr. Sarah & Tariq"
              location="Mumbai"
              story="We connected on Rishte Forever in 2025. The manual screening call gave us assurance, and our families met within two weeks. We tied the knot in Bandra."
              weddingDate="May 12, 2025"
              imageIndex={0}
            />
            <SuccessStoryCard
              names="Aisha & Khalid"
              location="Delhi"
              story="As a divorcee, finding a compatible match was hard. The Second-Marriage package counseling checked details and connected me with Khalid. We are blessed."
              weddingDate="April 4, 2026"
              imageIndex={1}
            />
            <SuccessStoryCard
              names="Adnan & Yasmin"
              location="Bangalore"
              story="We purchased the standard monthly membership. The photo masking feature kept my privacy intact. I recommend this platform to serious candidates."
              weddingDate="Dec 15, 2024"
              imageIndex={2}
            />
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
