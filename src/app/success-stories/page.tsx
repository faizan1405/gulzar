'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { SectionHeading, SuccessStoryCard, PremiumFooter } from '../../components/NikahComponents';

export default function SuccessStoriesPage() {
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
            title="Blessed Success Stories"
            subtitle="Alhamdulillah! Read inspiring stories of marriage from blessed couples."
            scriptText="Nikah Testimonials"
          />

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <SuccessStoryCard
              names="Dr. Sarah & Tariq"
              location="Mumbai"
              story="We connected on Shadi Mubarak in 2025. The manual screening call gave us assurance, and our families met within two weeks. We tied the knot in Bandra."
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
