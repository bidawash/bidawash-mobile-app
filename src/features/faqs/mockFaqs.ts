export type Faq = {
  id: string;
  question: string;
  answer: string;
  // Loose string so Supabase-managed categories don't need a client
  // change to add a new one.
  category?: string;
};

// Bundled fallback used when the Supabase `faqs` table is empty or the
// fetch fails. Kept short and matched to the canonical customer FAQ
// source (docs/faqs.csv) so the screen stays consistent even offline.
// The full list lives in Supabase — see supabase/seed/faqs.sql.
export const mockFaqs: Faq[] = [
  {
    id: 'what-is-bidawash',
    question: 'What is BidaWash?',
    answer:
      'BidaWash is a touchless automated car wash designed to provide a fast, convenient, and high-quality vehicle cleaning experience.',
    category: 'General',
  },
  {
    id: 'how-does-it-work',
    question: 'How does BidaWash work?',
    answer:
      'Simply drive into the wash bay, follow the on-site instructions, select your wash package, make your payment, and allow the automated system to clean your vehicle. Our on-site staff can also assist you and perform final spot checks when needed.',
    category: 'General',
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer:
      'BidaWash is cashless. We accept supported credit and debit cards as well as QRPh-compatible e-wallet payments.',
    category: 'Payments & Refunds',
  },
  {
    id: 'locations-and-hours',
    question: 'Where are your locations and what are your operating hours?',
    answer:
      'BidaWash operates daily from 8:00 AM to 7:00 PM. Locations are listed in the Locations tab of this app.',
    category: 'Locations & Operating Hours',
  },
  {
    id: 'wash-satisfaction',
    question: 'What if I am not satisfied with the wash result?',
    answer:
      'Please let our on-site team know immediately. We inspect every vehicle after the automated wash and can perform additional spot cleaning or final touches where needed.',
    category: 'Wash Packages & Results',
  },
];
