export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'membership' | 'payments' | 'locations';
};

export const mockFaqs: Faq[] = [
  {
    id: 'how-long',
    question: 'How long does a wash take?',
    answer:
      'Express Wash takes about 15 minutes. Premium Wash is 30–40 minutes. Detailing services can take 2–3 hours depending on package.',
    category: 'general',
  },
  {
    id: 'walk-ins',
    question: 'Do you accept walk-ins?',
    answer:
      'Yes — walk-ins are welcome at all branches during operating hours. Members and pre-booked customers are prioritized during peak times.',
    category: 'general',
  },
  {
    id: 'payments',
    question: 'What payment methods do you accept?',
    answer:
      'Cash, all major credit and debit cards, GCash, and Maya. In-app payments and digital wash passes are coming in our next release.',
    category: 'payments',
  },
  {
    id: 'membership-coming',
    question: 'When will memberships be available?',
    answer:
      'Memberships and pre-paid wash packages are launching soon. Sign up to be notified the moment they go live.',
    category: 'membership',
  },
  {
    id: 'rain',
    question: 'What happens if it rains right after I wash my car?',
    answer:
      'We offer a free re-wash within 48 hours if it rains. Just bring your receipt or show your in-app history.',
    category: 'general',
  },
];
