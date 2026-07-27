'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { SectionHeading, PremiumFooter } from '../../components/NikahComponents';
import { FAQ_DATA, FAQ_CATEGORIES, normalizeMessage, type FaqCategory } from '../../lib/faqData';

const ALL = 'All';

export default function FAQClient() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory | typeof ALL>(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    router.push('/' + (view === 'home' ? '' : view));
  };

  const openChatbot = () => {
    window.dispatchEvent(new Event('rf-open-chatbot'));
  };

  const filtered = useMemo(() => {
    const nq = normalizeMessage(query);
    return FAQ_DATA.filter((f) => {
      if (activeCategory !== ALL && f.category !== activeCategory) return false;
      if (!nq) return true;
      const haystack = normalizeMessage(
        `${f.question} ${f.answer} ${f.category} ${f.keywords.join(' ')}`
      );
      return haystack.includes(nq);
    });
  }, [query, activeCategory]);

  // Only show category chips that currently have at least one matching question.
  const visibleCategories = useMemo(() => {
    const nq = normalizeMessage(query);
    if (!nq) return FAQ_CATEGORIES;
    const present = new Set(
      FAQ_DATA.filter((f) =>
        normalizeMessage(`${f.question} ${f.answer} ${f.category} ${f.keywords.join(' ')}`).includes(nq)
      ).map((f) => f.category)
    );
    return FAQ_CATEGORIES.filter((c) => present.has(c));
  }, [query]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container font-sans" style={{ padding: '40px 0 80px 0' }}>
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Clear answers about registration, verification, privacy, memberships and staying safe on Rishte Forever."
            scriptText="Help & Guidance"
            as="h1"
          />

          <div className="faq-shell">
            {/* Search */}
            <div className="faq-search-wrap">
              <svg className="faq-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="faq-search-input"
                placeholder="Search questions (e.g. verification, photos, membership)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search frequently asked questions"
              />
              {query && (
                <button className="faq-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="faq-filter-row" role="tablist" aria-label="FAQ categories">
              <button
                className={`faq-chip ${activeCategory === ALL ? 'faq-chip-active' : ''}`}
                onClick={() => setActiveCategory(ALL)}
                role="tab"
                aria-selected={activeCategory === ALL}
              >
                All
              </button>
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  className={`faq-chip ${activeCategory === cat ? 'faq-chip-active' : ''}`}
                  onClick={() => setActiveCategory((prev) => (prev === cat ? ALL : cat))}
                  role="tab"
                  aria-selected={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results */}
            {filtered.length > 0 ? (
              <div className="faq-list">
                {filtered.map((f) => {
                  const isOpen = openId === f.id;
                  const panelId = `faq-panel-${f.id}`;
                  const btnId = `faq-btn-${f.id}`;
                  return (
                    <div key={f.id} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
                      <h3 className="faq-q-heading">
                        <button
                          id={btnId}
                          className="faq-q-btn"
                          onClick={() => toggle(f.id)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                        >
                          <span className="faq-q-text">{f.question}</span>
                          <span className="faq-q-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                      </h3>
                      {isOpen && (
                        <div id={panelId} role="region" aria-labelledby={btnId} className="faq-answer">
                          <p>{f.answer}</p>
                          <span className="faq-answer-tag">{f.category}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="faq-empty">
                <div className="faq-empty-icon" aria-hidden="true">🔍</div>
                <h3 className="faq-empty-title">No matching questions</h3>
                <p className="faq-empty-text">
                  We could not find an answer for “{query}”. Try a different keyword, browse all categories, or reach our team.
                </p>
                <button className="btn btn-secondary" onClick={() => { setQuery(''); setActiveCategory(ALL); }}>
                  Reset filters
                </button>
              </div>
            )}

            {/* Still need help */}
            <div className="faq-help arch-container gold-rim">
              <h4 className="faq-help-title">Still need help?</h4>
              <p className="faq-help-text">
                Cannot find your answer? Our support team is happy to help, or you can ask our assistant right away.
              </p>
              <div className="faq-help-actions">
                <Link href="/contact" className="btn btn-primary">Contact Support</Link>
                <button className="btn btn-secondary" onClick={openChatbot}>Ask the Assistant</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PremiumFooter onNavigate={handleNavigate} />
    </>
  );
}
