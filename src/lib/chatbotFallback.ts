export function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  // 1. Religious / Fatwa check
  if (
    msg.includes('fatwa') ||
    msg.includes('halal') ||
    msg.includes('haram') ||
    msg.includes('shariah') ||
    msg.includes('ruling') ||
    msg.includes('islamic') ||
    msg.includes('scholar') ||
    msg.includes('sin') ||
    msg.includes('quran') ||
    msg.includes('hadith')
  ) {
    return "For religious rulings, please consult a qualified scholar. I can only explain how Shadi Mubarak works as a matrimonial platform.";
  }

  // 2. Photo / Phone blur / Privacy check
  if (
    msg.includes('blur') ||
    msg.includes('photo') ||
    msg.includes('phone') ||
    msg.includes('unblur') ||
    msg.includes('hide') ||
    msg.includes('visible') ||
    msg.includes('number') ||
    msg.includes('show') ||
    msg.includes('privacy') ||
    msg.includes('picture') ||
    msg.includes('image') ||
    msg.includes('contact')
  ) {
    return "Profile photos and phone numbers are protected for privacy. You need to follow the membership/package process to access eligible details. For standard profiles, a ₹300 Monthly Membership is required to unblur photos and contact details.";
  }

  // 3. Packages & Pricing check
  if (
    msg.includes('package') ||
    msg.includes('price') ||
    msg.includes('pricing') ||
    msg.includes('cost') ||
    msg.includes('fee') ||
    msg.includes('subscribe') ||
    msg.includes('subscription') ||
    msg.includes('pay') ||
    msg.includes('payment') ||
    msg.includes('gst') ||
    msg.includes('rs') ||
    msg.includes('₹') ||
    msg.includes('money') ||
    msg.includes('membership') ||
    msg.includes('monthly') ||
    msg.includes('rupees') ||
    msg.includes('charge')
  ) {
    return "Assalamu Alaikum! Shadi Mubarak offers 4 matrimonial packages (inclusive of 18% GST):\n\n" +
      "1. **Standard Monthly Membership**: ₹300/month (₹354 with GST). Allows searching matches, filtering, and unblurring photos/phone numbers on normal profiles.\n" +
      "2. **Good Profiles Package**: ₹5,500 one-time (₹6,490 with GST). Gives access to curated, hand-selected attractive profiles + ₹21,000 success fee after marriage confirmation.\n" +
      "3. **Second Marriage Package**: ₹11,000 one-time (₹12,980 with GST). Separate private matchmaking category with unlimited leads until marriage. No success fee.\n" +
      "4. **High Profile Package**: ₹21,000 one-time (₹24,780 with GST). For doctors, engineers, premium families, and candidates earning ₹10 Lakhs+ annually + ₹25,000 success fee after marriage.";
  }

  // 4. Verification check
  if (
    msg.includes('verify') ||
    msg.includes('verification') ||
    msg.includes('approved') ||
    msg.includes('pending') ||
    msg.includes('call') ||
    msg.includes('review') ||
    msg.includes('approve') ||
    msg.includes('status')
  ) {
    return "Every profile on Shadi Mubarak is manually reviewed. An admin will call you on your registered phone number to verify your identity and intent. Once approved, your profile status will change to APPROVED, making you visible in the match directory.";
  }

  // 5. Registration check
  if (
    msg.includes('register') ||
    msg.includes('registration') ||
    msg.includes('signup') ||
    msg.includes('sign up') ||
    msg.includes('join') ||
    msg.includes('create') ||
    msg.includes('wizard') ||
    msg.includes('account')
  ) {
    return "To register, click the 'Register' button on the homepage. Use our 5-step onboarding wizard to enter your details, family background, partner expectations, select a custom color theme, and submit your profile. Our admin team will contact you soon after to complete manual verification.";
  }

  // 6. Search check
  if (
    msg.includes('search') ||
    msg.includes('filter') ||
    msg.includes('find') ||
    msg.includes('match') ||
    msg.includes('directory') ||
    msg.includes('browse')
  ) {
    return "Once your profile is verified and you have an active membership, you can use our Search page to filter matches by age, location, occupation, marital status, and education to find compatible matches.";
  }

  // 7. Support / Contact check
  if (
    msg.includes('support') ||
    msg.includes('contact') ||
    msg.includes('help') ||
    msg.includes('email') ||
    msg.includes('office') ||
    msg.includes('address') ||
    msg.includes('admin') ||
    msg.includes('reach')
  ) {
    return "You can contact Shadi Mubarak support by navigating to the Contact page or by emailing support@shadimubarak.com. Our support team is active Monday to Saturday, 9:00 AM to 6:00 PM.";
  }

  // 8. General greeting/unknown fallback response
  return "Assalamu Alaikum! I'm the Shadi Mubarak support assistant (demo mode).\n\n" +
    "I can answer your questions about:\n" +
    "• **Packages & Pricing** (₹300/₹5.5k/₹11k/₹21k)\n" +
    "• **Photo & Contact Privacy** (Blurring details)\n" +
    "• **Manual Verification** (Telephone review process)\n" +
    "• **Registration** & Onboarding\n" +
    "• **Search Filters** & Matchmaking\n" +
    "• **Contacting Support**\n\n" +
    "Please ask me about any of these topics!";
}
