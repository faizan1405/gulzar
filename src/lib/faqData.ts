import { PREMIUM_PACKAGES, PACKAGE_KEYS } from './packages';

/**
 * SINGLE SHARED FAQ KNOWLEDGE SOURCE
 * ----------------------------------
 * This file is the ONLY place FAQ question/answer wording should live. The public
 * `/faq` page, the "How It Works" preview, the chatbot API route and the offline
 * chatbot fallback all read from here so answers never drift out of sync.
 *
 * Content rules baked in (do not break these):
 *  - Package NAMES come from `packages.ts` (the source of truth). We never restate
 *    a package label anywhere else.
 *  - Package PRICES are intentionally hidden in public content. The project blurs
 *    pricing until a member completes their profile, so answers only say that
 *    current pricing appears on the Premium page after profile completion.
 *  - No invented guarantees, discounts, refund promises, timelines or religious
 *    rulings. Religious questions are always referred to a qualified scholar.
 */

export type FaqCategory =
  | 'Getting Started'
  | 'Registration & Google Login'
  | 'Profile Completion & Editing'
  | 'Telephone Verification'
  | 'Profile Approval & Visibility'
  | 'Browsing & Search Filters'
  | 'Photo & Contact Privacy'
  | 'Monthly Membership'
  | 'Good Profile Package'
  | 'Silver Plan'
  | 'Gold Package'
  | 'Payments & Package Activation'
  | 'Second-Marriage Profiles'
  | 'Family Involvement'
  | 'Safety & Scam Prevention'
  | 'Reporting Suspicious Profiles'
  | 'Account & Support'
  | 'Platform Rules & Limitations';

export interface FaqEntry {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  keywords: string[];
}

// Package labels pulled from the source of truth so wording stays in sync.
const MONTHLY = PREMIUM_PACKAGES[PACKAGE_KEYS.MONTHLY].name; // "Monthly Membership"
const GOOD = PREMIUM_PACKAGES[PACKAGE_KEYS.GOOD_PROFILE].name; // "Good Profile Package"
const SILVER = PREMIUM_PACKAGES[PACKAGE_KEYS.SILVER].name; // "Silver Plan"
const GOLD = PREMIUM_PACKAGES[PACKAGE_KEYS.GOLD].name; // "Gold Package"

// Shared, project-accurate support contact line. Mirrors the Contact page.
export const SUPPORT_EMAIL = 'support@rishteforever.in';
export const SUPPORT_PHONE = '+91 96754 83125';
export const SUPPORT_HOURS = '10 AM to 6 PM';

// The list of categories, in the order the FAQ page and filters should show them.
export const FAQ_CATEGORIES: FaqCategory[] = [
  'Getting Started',
  'Registration & Google Login',
  'Profile Completion & Editing',
  'Telephone Verification',
  'Profile Approval & Visibility',
  'Browsing & Search Filters',
  'Photo & Contact Privacy',
  'Monthly Membership',
  'Good Profile Package',
  'Silver Plan',
  'Gold Package',
  'Payments & Package Activation',
  'Second-Marriage Profiles',
  'Family Involvement',
  'Safety & Scam Prevention',
  'Reporting Suspicious Profiles',
  'Account & Support',
  'Platform Rules & Limitations',
];

export const FAQ_DATA: FaqEntry[] = [
  // ── Getting Started ───────────────────────────────────────────────────────
  {
    id: 'what-is-rishte-forever',
    category: 'Getting Started',
    question: 'What is Rishte Forever?',
    answer:
      'Rishte Forever is a trusted Muslim matrimonial platform for people seriously looking for marriage. Every profile is manually reviewed and telephone-verified before it becomes visible, and family involvement is encouraged throughout. It is a marriage platform, not a dating application.',
    keywords: ['what is', 'rishte forever', 'about', 'platform', 'matrimonial', 'website', 'purpose'],
  },
  {
    id: 'is-it-a-dating-app',
    category: 'Getting Started',
    question: 'Is Rishte Forever a dating app?',
    answer:
      'No. Rishte Forever is a matrimonial platform for people seeking marriage, not casual dating. We encourage respectful, family-involved introductions and manually verify members to keep the community serious and safe.',
    keywords: ['dating', 'dating app', 'casual', 'hookup', 'girlfriend', 'boyfriend', 'not dating'],
  },
  {
    id: 'how-do-i-start',
    category: 'Getting Started',
    question: 'How do I get started?',
    answer:
      'Sign in securely with Google, complete the registration wizard with your details and family background, and submit your profile. Our team then does a telephone verification call. Once approved, your profile becomes visible and you can browse matches.',
    keywords: ['get started', 'start', 'begin', 'how to use', 'first step', 'new user'],
  },

  // ── Registration & Google Login ───────────────────────────────────────────
  {
    id: 'how-to-register',
    category: 'Registration & Google Login',
    question: 'How do I register on Rishte Forever?',
    answer:
      'Click Register on the homepage and sign in with Google. Then complete the multi-step registration wizard covering your personal details, education, occupation, religious outlook and family background. After you submit, your profile enters the verification queue.',
    keywords: ['register', 'registration', 'sign up', 'signup', 'join', 'create account', 'onboarding', 'wizard'],
  },
  {
    id: 'is-registration-free',
    category: 'Registration & Google Login',
    question: 'Is registration free?',
    answer:
      'Yes, registering and creating your profile is free. Paid access is only needed later to view protected details such as unblurred photos and phone numbers of other members. Current pricing becomes available on the Premium page after you complete your profile.',
    keywords: ['free', 'cost to register', 'registration free', 'is it free', 'free to join', 'charge to sign up'],
  },
  {
    id: 'why-google-login',
    category: 'Registration & Google Login',
    question: 'Why do I have to sign in with Google?',
    answer:
      'Rishte Forever uses Google sign-in so your account stays secure without you managing another password. It also helps us keep the community accountable, which supports our manual verification process.',
    keywords: ['google', 'google login', 'sign in', 'login', 'oauth', 'why google', 'password'],
  },
  {
    id: 'no-google-account',
    category: 'Registration & Google Login',
    question: 'What if I do not have a Google account?',
    answer:
      "Sign-in currently uses Google. If you do not have a Google account you can create one for free, or contact our support team so they can guide you. Reach us at " +
      SUPPORT_EMAIL + '.',
    keywords: ['no google', "don't have google", 'without google', 'other login', 'email login', 'alternative sign in'],
  },

  // ── Profile Completion & Editing ──────────────────────────────────────────
  {
    id: 'complete-profile',
    category: 'Profile Completion & Editing',
    question: 'How do I complete my profile?',
    answer:
      'Fill in every step of the registration wizard, including personal details, family background and partner expectations. A complete profile helps verification go smoothly and unlocks current package pricing on the Premium page.',
    keywords: ['complete profile', 'finish profile', 'profile completion', 'fill profile', 'incomplete profile'],
  },
  {
    id: 'edit-profile',
    category: 'Profile Completion & Editing',
    question: 'Can I edit my profile after submitting?',
    answer:
      'Yes. You can update your details from your account area. Note that significant changes may be reviewed again to keep information accurate for other members.',
    keywords: ['edit profile', 'update profile', 'change details', 'modify profile', 'correct information'],
  },
  {
    id: 'why-complete-needed',
    category: 'Profile Completion & Editing',
    question: 'Why do I need to complete my profile before seeing pricing?',
    answer:
      'Package pricing is shown only after your profile is complete. This keeps the platform focused on serious members and lets us present the right options for your situation. Once complete, current pricing appears on the Premium page.',
    keywords: ['pricing hidden', 'why complete', 'see price', 'unlock pricing', 'price locked', 'complete to see price'],
  },

  // ── Telephone Verification ────────────────────────────────────────────────
  {
    id: 'how-verification-works',
    category: 'Telephone Verification',
    question: 'How does telephone verification work?',
    answer:
      'After you submit your profile, an administrator calls the phone number you registered to confirm your details, marital background and serious intent. This manual check protects the whole community before a profile goes live.',
    keywords: ['verification', 'verify', 'telephone', 'phone verification', 'call', 'admin call', 'how verify'],
  },
  {
    id: 'why-verification',
    category: 'Telephone Verification',
    question: 'Why is manual verification required?',
    answer:
      'Manual telephone verification keeps the community genuine and safe. By speaking with each new member we reduce fake and non-serious profiles before they ever appear in search results.',
    keywords: ['why verify', 'why verification', 'manual verification', 'reason verification', 'need to verify'],
  },
  {
    id: 'verification-time',
    category: 'Telephone Verification',
    question: 'How long does verification take?',
    answer:
      'Verification is a manual call handled by our team, so timing can vary. Please keep your registered phone number reachable. If you have waited a while, contact support at ' +
      SUPPORT_EMAIL + ' and our team will follow up.',
    keywords: ['how long verification', 'verification time', 'when verified', 'verification delay', 'still pending', 'not verified yet'],
  },
  {
    id: 'missed-verification-call',
    category: 'Telephone Verification',
    question: 'What if I miss the verification call?',
    answer:
      'If you miss the call, keep your phone reachable for a follow-up attempt. You can also reach out to support at ' +
      SUPPORT_PHONE + ' (' + SUPPORT_HOURS + ') so the team can reconnect with you.',
    keywords: ['missed call', 'miss verification', 'no call', "didn't get call", 'call back', 'reschedule call'],
  },

  // ── Profile Approval & Visibility ─────────────────────────────────────────
  {
    id: 'when-visible',
    category: 'Profile Approval & Visibility',
    question: 'When does my profile become visible to others?',
    answer:
      'Your profile appears in search only after it is approved following telephone verification. Until then its status stays pending and it is hidden from other members.',
    keywords: ['visible', 'visibility', 'appear in search', 'show up', 'when approved', 'profile live', 'not showing'],
  },
  {
    id: 'approval-status',
    category: 'Profile Approval & Visibility',
    question: 'What does profile approval mean?',
    answer:
      'Approval means your profile passed manual telephone verification and its status is now approved. Approved profiles are eligible to appear in the match directory for other members.',
    keywords: ['approval', 'approved', 'status', 'pending status', 'profile status', 'what is approval'],
  },
  {
    id: 'profile-rejected',
    category: 'Profile Approval & Visibility',
    question: 'What if my profile is not approved?',
    answer:
      'If a profile cannot be verified or is missing key details, it stays hidden. Please make sure your information is accurate and complete, and contact support at ' +
      SUPPORT_EMAIL + ' if you need help.',
    keywords: ['rejected', 'not approved', 'declined', 'profile hidden', 'disapproved', 'failed verification'],
  },

  // ── Browsing & Search Filters ─────────────────────────────────────────────
  {
    id: 'how-to-search',
    category: 'Browsing & Search Filters',
    question: 'How do I search for matches?',
    answer:
      'Once your profile is approved, use the Search page to browse profiles. You can filter by criteria such as age, location, occupation, education and marital status to find compatible matches.',
    keywords: ['search', 'find match', 'browse', 'directory', 'look for', 'how to search', 'find profiles'],
  },
  {
    id: 'search-filters',
    category: 'Browsing & Search Filters',
    question: 'What search filters are available?',
    answer:
      'You can narrow matches using filters like age, location, occupation, education and marital status. Combining filters helps you focus on the most compatible profiles.',
    keywords: ['filters', 'filter options', 'search filter', 'age filter', 'location filter', 'occupation', 'education'],
  },
  {
    id: 'browse-without-membership',
    category: 'Browsing & Search Filters',
    question: 'Can I browse without a membership?',
    answer:
      'You can view the directory, but photos and phone numbers stay protected for non-paying members. To view unblurred photos and contact details of normal profiles you need an active ' +
      MONTHLY + '.',
    keywords: ['browse free', 'search without paying', 'view without membership', 'free browsing', 'see profiles free'],
  },

  // ── Photo & Contact Privacy ───────────────────────────────────────────────
  {
    id: 'why-photos-blurred',
    category: 'Photo & Contact Privacy',
    question: 'Why are photos and phone numbers blurred?',
    answer:
      'Photos and phone numbers are protected to safeguard the privacy and modesty of our members. They stay hidden for non-logged-in visitors and non-paying members, and become viewable for normal profiles through an active ' +
      MONTHLY + '.',
    keywords: ['blur', 'blurred', 'photo hidden', 'phone hidden', 'why blurred', 'hidden photo', 'protected', 'unblur'],
  },
  {
    id: 'how-to-see-photos',
    category: 'Photo & Contact Privacy',
    question: 'How can I see full photos and contact details?',
    answer:
      'For normal profiles, activate a ' + MONTHLY +
      ' to view unblurred photos and phone numbers. Access always follows our privacy rules, and current pricing is shown on the Premium page after your profile is complete.',
    keywords: ['see photo', 'view contact', 'unblur photo', 'get phone number', 'access details', 'view number'],
  },
  {
    id: 'is-my-photo-safe',
    category: 'Photo & Contact Privacy',
    question: 'Is my own photo safe on the platform?',
    answer:
      'Yes. Your photo and phone number are protected by the same privacy rules and stay blurred for non-paying and non-logged-in users. This keeps your details private until an eligible member follows the proper access process.',
    keywords: ['my photo safe', 'photo privacy', 'is my photo protected', 'photo security', 'private photo', 'my number safe'],
  },

  // ── Monthly Membership ────────────────────────────────────────────────────
  {
    id: 'what-is-monthly',
    category: 'Monthly Membership',
    question: 'What does the Monthly Membership include?',
    answer:
      'The ' + MONTHLY +
      ' lets you search and filter the directory and view unblurred photos and phone numbers on normal profiles, so you can contact eligible candidates directly. Current pricing is on the Premium page after you complete your profile.',
    keywords: ['monthly membership', 'monthly', 'membership', 'subscription benefit', 'what does membership include'],
  },
  {
    id: 'why-need-membership',
    category: 'Monthly Membership',
    question: 'Why do I need a Monthly Membership?',
    answer:
      'A ' + MONTHLY +
      ' unlocks the details you need to move forward on normal profiles, such as unblurred photos and contact numbers, while keeping everyone\'s information protected from non-paying users.',
    keywords: ['why membership', 'need membership', 'why pay monthly', 'membership reason', 'why subscribe'],
  },

  // ── Good Profile Package ──────────────────────────────────────────────────
  {
    id: 'what-is-good-profile',
    category: 'Good Profile Package',
    question: 'What is the Good Profile Package?',
    answer:
      'The ' + GOOD +
      ' offers verified profile suggestions, basic matchmaking support and privacy-safe profile sharing, with one year of service validity. Current pricing is shown on the Premium page after you complete your profile.',
    keywords: ['good profile package', 'good profile', 'curated', 'matchmaking support', 'profile suggestions'],
  },
  {
    id: 'good-profile-validity',
    category: 'Good Profile Package',
    question: 'How long is the Good Profile Package valid?',
    answer:
      'The ' + GOOD +
      ' carries one year of service validity. A success fee may apply after a confirmed marriage; current amounts are shown on the Premium page after your profile is complete.',
    keywords: ['good profile validity', 'good profile duration', 'one year', 'validity period', 'good profile success fee'],
  },

  // ── Silver Plan ───────────────────────────────────────────────────────────
  {
    id: 'what-is-silver',
    category: 'Silver Plan',
    question: 'What is the Silver Plan?',
    answer:
      'The ' + SILVER +
      ' builds on the basic package with more verified profile suggestions, priority matchmaking support, profile shortlisting and family coordination, with one year of service validity. Current pricing appears on the Premium page after your profile is complete.',
    keywords: ['silver plan', 'silver', 'priority matchmaking', 'shortlisting', 'family coordination'],
  },
  {
    id: 'silver-vs-good',
    category: 'Silver Plan',
    question: 'How is the Silver Plan different from the Good Profile Package?',
    answer:
      'The ' + SILVER + ' includes everything in the basic package plus more verified suggestions, priority matchmaking, shortlisting help, family coordination and regular follow-up support. The ' +
      GOOD + ' covers verified suggestions and basic matchmaking support. Compare current options on the Premium page after completing your profile.',
    keywords: ['silver vs good', 'difference silver', 'compare silver', 'silver or good', 'which package'],
  },

  // ── Gold Package ──────────────────────────────────────────────────────────
  {
    id: 'what-is-gold',
    category: 'Gold Package',
    question: 'What is the Gold Package?',
    answer:
      'The ' + GOLD +
      ' includes everything in the Silver Plan plus premium verified suggestions, high-priority matchmaking, personalized shortlisting, dedicated support, family meeting coordination and biodata presentation guidance, with one year of service validity. Current pricing is on the Premium page after your profile is complete.',
    keywords: ['gold package', 'gold', 'premium', 'high profile', 'dedicated support', 'high priority'],
  },
  {
    id: 'gold-success-fee',
    category: 'Gold Package',
    question: 'Does the Gold Package have a success fee?',
    answer:
      'The ' + GOLD +
      ' can include a success fee that applies only after a confirmed marriage. Current amounts and terms are shown on the Premium page once your profile is complete.',
    keywords: ['gold success fee', 'success fee', 'gold fee', 'fee after marriage', 'gold cost'],
  },

  // ── Payments & Package Activation ─────────────────────────────────────────
  {
    id: 'how-to-pay',
    category: 'Payments & Package Activation',
    question: 'How do I pay for a package?',
    answer:
      'Payments are handled securely on the official Premium/Packages page through the checkout provided there. Never share card, UPI or banking details in chat or with anyone claiming to represent us.',
    keywords: ['how to pay', 'payment', 'checkout', 'pay package', 'buy package', 'purchase', 'razorpay'],
  },
  {
    id: 'when-package-activates',
    category: 'Payments & Package Activation',
    question: 'When does my package activate after payment?',
    answer:
      'Your package activates once payment is confirmed through the official checkout. If access does not update, contact support at ' +
      SUPPORT_EMAIL + ' and the team will help.',
    keywords: ['activate package', 'activation', 'after payment', 'package active', 'not activated', 'payment done'],
  },
  {
    id: 'where-is-pricing',
    category: 'Payments & Package Activation',
    question: 'Where can I see current pricing?',
    answer:
      'Current pricing is shown on the Premium page after you complete your profile. Pricing is kept private until then to keep the platform focused on serious members.',
    keywords: ['pricing', 'price', 'cost', 'how much', 'fees', 'rates', 'see price', 'where pricing'],
  },

  // ── Second-Marriage Profiles ──────────────────────────────────────────────
  {
    id: 'second-marriage-support',
    category: 'Second-Marriage Profiles',
    question: 'Does Rishte Forever support second-marriage profiles?',
    answer:
      'Yes. Rishte Forever welcomes members seeking a second marriage and handles these profiles respectfully and privately. The ' +
      SILVER + ' is tailored to support this category with priority matchmaking and coordination.',
    keywords: ['second marriage', 'divorced', 'widow', 'widower', 'remarriage', 'second nikah', 'again marriage'],
  },
  {
    id: 'second-marriage-privacy',
    category: 'Second-Marriage Profiles',
    question: 'Are second-marriage profiles kept private?',
    answer:
      'Yes. Second-marriage profiles follow the same strict privacy rules as all profiles, and our matchmaking support handles them discreetly and respectfully.',
    keywords: ['second marriage private', 'divorced privacy', 'discreet', 'confidential second marriage', 'private remarriage'],
  },

  // ── Family Involvement ────────────────────────────────────────────────────
  {
    id: 'family-involvement',
    category: 'Family Involvement',
    question: 'Can my family be involved in the process?',
    answer:
      'Yes, and we encourage it. Rishte Forever is built around family-involved, respectful introductions. We recommend involving family early and arranging chaperoned conversations as you move forward.',
    keywords: ['family', 'parents', 'family involvement', 'guardian', 'wali', 'involve family', 'family process'],
  },
  {
    id: 'family-register',
    category: 'Family Involvement',
    question: 'Can a parent or guardian create a profile for someone?',
    answer:
      'Families often help complete profiles and coordinate introductions. Please keep the information accurate and ensure the candidate consents, since telephone verification confirms details directly.',
    keywords: ['parent register', 'guardian profile', 'create for someone', 'family register', 'on behalf'],
  },

  // ── Safety & Scam Prevention ──────────────────────────────────────────────
  {
    id: 'never-send-money',
    category: 'Safety & Scam Prevention',
    question: 'Should I ever send money to another profile?',
    answer:
      'No. Never send money, gifts or payments to another member or anyone claiming to represent Rishte Forever privately. Legitimate payments only happen on the official Premium/Packages page. Treat any such request as a scam.',
    keywords: ['send money', 'money request', 'scam', 'fraud', 'asked for money', 'pay another member', 'transfer money'],
  },
  {
    id: 'stay-safe',
    category: 'Safety & Scam Prevention',
    question: 'How can I stay safe while using the platform?',
    answer:
      'Involve your family early, keep conversations respectful and on-platform where possible, never share banking details, and never send money to another profile. If something feels off, report the profile and contact support.',
    keywords: ['stay safe', 'safety tips', 'be safe', 'protect myself', 'safe matchmaking', 'avoid scam'],
  },
  {
    id: 'is-my-data-secure',
    category: 'Safety & Scam Prevention',
    question: 'Is my personal information secure?',
    answer:
      'Your photo and phone number stay protected under our privacy rules, and payments are handled only through the official secure checkout. We never ask for card or banking details in chat.',
    keywords: ['data secure', 'information safe', 'personal data', 'data privacy', 'secure', 'is my data safe'],
  },

  // ── Reporting Suspicious Profiles ─────────────────────────────────────────
  {
    id: 'report-profile',
    category: 'Reporting Suspicious Profiles',
    question: 'How do I report a suspicious profile?',
    answer:
      'If a profile seems fake, abusive or asks for money, contact our support team at ' +
      SUPPORT_EMAIL + ' or ' + SUPPORT_PHONE + ' (' + SUPPORT_HOURS +
      ') with the details. Manual verification helps, but member reports keep the community safer.',
    keywords: ['report', 'report profile', 'suspicious', 'fake profile', 'abusive', 'complaint', 'flag'],
  },
  {
    id: 'what-to-report',
    category: 'Reporting Suspicious Profiles',
    question: 'What behaviour should I report?',
    answer:
      'Report anyone who asks for money, pressures you, shares inappropriate content, or seems to be using a fake identity. Reporting helps our team review and act to protect other members.',
    keywords: ['what to report', 'reportable', 'bad behaviour', 'harassment', 'inappropriate', 'when to report'],
  },

  // ── Account & Support ─────────────────────────────────────────────────────
  {
    id: 'contact-support',
    category: 'Account & Support',
    question: 'How do I contact support?',
    answer:
      'You can reach the Rishte Forever team through the Contact page, by email at ' +
      SUPPORT_EMAIL + ', or by phone at ' + SUPPORT_PHONE + '. Support is available ' + SUPPORT_HOURS + '.',
    keywords: ['contact', 'support', 'help', 'email', 'phone number support', 'reach', 'customer care', 'contact us'],
  },
  {
    id: 'support-hours',
    category: 'Account & Support',
    question: 'What are the support hours?',
    answer:
      'Our support team is generally available ' + SUPPORT_HOURS +
      '. You can email ' + SUPPORT_EMAIL + ' any time and the team will respond during working hours.',
    keywords: ['support hours', 'timing', 'working hours', 'open hours', 'when available', 'office hours'],
  },
  {
    id: 'manage-account',
    category: 'Account & Support',
    question: 'How do I manage my account?',
    answer:
      'You can manage your profile and details from your account area after signing in. For account changes you cannot make yourself, contact support at ' +
      SUPPORT_EMAIL + '.',
    keywords: ['manage account', 'account settings', 'my account', 'delete account', 'close account', 'account help'],
  },

  // ── Platform Rules & Limitations ──────────────────────────────────────────
  {
    id: 'no-marriage-guarantee',
    category: 'Platform Rules & Limitations',
    question: 'Does Rishte Forever guarantee marriage?',
    answer:
      'No. We help you discover verified, serious profiles and provide matchmaking support, but we cannot guarantee a marriage. Compatibility and outcomes depend on the members and their families.',
    keywords: ['guarantee', 'guaranteed marriage', 'promise', 'will i get married', 'assured match', 'guarantee partner'],
  },
  {
    id: 'religious-questions',
    category: 'Platform Rules & Limitations',
    question: 'Can the platform answer religious rulings?',
    answer:
      'For religious rulings or halal/haram questions, please consult a qualified scholar. We can only explain how Rishte Forever works as a matrimonial platform.',
    keywords: ['fatwa', 'halal', 'haram', 'ruling', 'religious', 'scholar', 'islamic ruling', 'shariah', 'quran', 'hadith'],
  },
  {
    id: 'no-private-info',
    category: 'Platform Rules & Limitations',
    question: 'Can I get another member\'s phone number or photo directly?',
    answer:
      'No. Profile photos and phone numbers are protected for privacy. You must follow the membership or package process to access eligible details; we never share another member\'s private information directly.',
    keywords: ['get someone number', 'another member photo', 'private info', 'share number', 'someone details', 'give me number'],
  },
  {
    id: 'no-payment-in-chat',
    category: 'Platform Rules & Limitations',
    question: 'Can I pay through the chatbot?',
    answer:
      'No. Never enter card, UPI or banking details in chat. All payments happen only on the official Premium/Packages page through secure checkout.',
    keywords: ['pay in chat', 'card in chat', 'upi chat', 'payment chat', 'give card details', 'bank details'],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * MATCHING HELPERS (lightweight, local — no external libraries)
 * ──────────────────────────────────────────────────────────────────────────── */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'i', 'my', 'me', 'to', 'of', 'and',
  'or', 'for', 'on', 'in', 'it', 'you', 'your', 'can', 'how', 'what', 'why', 'when',
  'where', 'this', 'that', 'with', 'as', 'be', 'if', 'so', 'we', 'us', 'am', 'at',
  'have', 'has', 'get', 'about', 'from', 'will', 'need', 'want',
]);

/** Lowercase, strip punctuation, collapse whitespace. */
export function normalizeMessage(message: string): string {
  return (message || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(normalized: string): string[] {
  return normalized.split(' ').filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/** Score a single FAQ entry against a normalized message + its tokens. */
function scoreEntry(entry: FaqEntry, normalized: string, tokens: Set<string>): number {
  let score = 0;

  // Keyword matches: multi-word keywords use substring; single words use token match.
  for (const kw of entry.keywords) {
    const nkw = normalizeMessage(kw);
    if (!nkw) continue;
    if (nkw.includes(' ')) {
      if (normalized.includes(nkw)) score += 3;
    } else if (tokens.has(nkw)) {
      score += 2;
    }
  }

  // Overlap between meaningful question words and the message tokens.
  const questionTokens = tokenize(normalizeMessage(entry.question));
  if (questionTokens.length) {
    let overlap = 0;
    for (const qt of questionTokens) if (tokens.has(qt)) overlap += 1;
    score += (overlap / questionTokens.length) * 4;
  }

  return score;
}

/** Rank all FAQ entries for a message, best first, filtering out zero scores. */
function rankEntries(message: string): Array<{ entry: FaqEntry; score: number }> {
  const normalized = normalizeMessage(message);
  const tokens = new Set(tokenize(normalized));
  if (!normalized) return [];

  return FAQ_DATA
    .map((entry) => ({ entry, score: scoreEntry(entry, normalized, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Return a confident direct FAQ answer for a clear question, or null when the
 * question is ambiguous / off-topic and should go to the AI provider or a
 * generic reply. The threshold keeps weak, guessy matches out.
 */
export function findFaqAnswer(message: string): FaqEntry | null {
  const ranked = rankEntries(message);
  if (!ranked.length) return null;
  const best = ranked[0];
  if (best.score >= 5) return best.entry;
  return null;
}

/**
 * Return a small block of the most relevant FAQ entries as plain text, to inject
 * into the AI provider context. Keeps token usage low by capping the count.
 */
export function getRelevantFaqContext(message: string, limit = 4): string {
  const ranked = rankEntries(message).slice(0, limit);
  if (!ranked.length) return '';
  return ranked
    .map((r) => `Q: ${r.entry.question}\nA: ${r.entry.answer}`)
    .join('\n\n');
}

/**
 * Mandatory chatbot guardrails. These fire BEFORE any FAQ or AI answer so the
 * platform's non-negotiable rules always win: no religious rulings, no sharing
 * of another member's private info, and no payment details in chat. Returns the
 * required response string, or null when no guardrail applies.
 */
export function getGuardrailResponse(message: string): string | null {
  const n = normalizeMessage(message);
  if (!n) return null;

  const has = (words: string[]) => words.some((w) => n.includes(normalizeMessage(w)));

  // 1. Religious rulings / fatwa → refer to a scholar.
  if (has(['fatwa', 'halal', 'haram', 'shariah', 'sharia', 'islamic ruling', 'is it a sin', 'quran says', 'hadith', 'permissible', 'makruh'])) {
    return 'For religious rulings, please consult a qualified scholar. I can only explain how Rishte Forever works as a matrimonial platform.';
  }

  // 2. Request for another member's private info.
  if (
    has(['give me her number', 'give me his number', 'send me her number', 'send me his number', 'share her number', 'share his number', 'her phone number', 'his phone number', 'her photo', 'his photo', 'contact details of', 'someone number']) ||
    (has(['number', 'phone', 'photo', 'contact', 'whatsapp']) && has(['her ', 'his ', 'that girl', 'that boy', 'this profile', 'that profile', 'another member', 'other member', 'this member']))
  ) {
    return 'Profile photos and phone numbers are protected for privacy. You need to follow the membership or package process to access eligible details. I cannot share another member\'s private information directly.';
  }

  // 3. Attempt to pay / share card details in chat.
  if (has(['my card number', 'card number is', 'cvv', 'my upi', 'upi id is', 'my account number', 'take my payment', 'pay you here', 'enter card', 'bank account number'])) {
    return 'Please never enter card, UPI or banking details in chat. All payments happen only on the official Premium/Packages page through secure checkout.';
  }

  return null;
}

/** A handful of important questions for the "How It Works" preview. */
export const FAQ_PREVIEW_IDS = [
  'is-registration-free',
  'how-verification-works',
  'why-photos-blurred',
  'when-visible',
  'never-send-money',
  'no-marriage-guarantee',
];

export function getFaqPreview(): FaqEntry[] {
  return FAQ_PREVIEW_IDS.map((id) => FAQ_DATA.find((f) => f.id === id)).filter(
    (f): f is FaqEntry => Boolean(f)
  );
}

/** Suggested questions for the chatbot quick-start chips. */
export const CHATBOT_SUGGESTION_IDS = [
  'how-to-register',
  'how-verification-works',
  'why-photos-blurred',
  'what-is-monthly',
  'where-is-pricing',
  'never-send-money',
];

export function getChatbotSuggestions(): FaqEntry[] {
  return CHATBOT_SUGGESTION_IDS.map((id) => FAQ_DATA.find((f) => f.id === id)).filter(
    (f): f is FaqEntry => Boolean(f)
  );
}

/** Build FAQPage JSON-LD from the shared collection (plain-text answers). */
export function getFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}
