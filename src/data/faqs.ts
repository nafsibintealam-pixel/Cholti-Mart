export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Orders & Delivery',
    question: 'How does Cash on Delivery (COD) work at Cholti Mart?',
    answer: 'Cash on Delivery is available across all 64 districts in Bangladesh. You simply place your order without pre-paying online, and you pay the exact invoice amount in cash to the courier representative when the parcel reaches your doorstep.'
  },
  {
    id: 'faq-2',
    category: 'Orders & Delivery',
    question: 'What are the delivery charges and delivery timelines?',
    answer: 'Standard delivery inside Dhaka city is ৳70 (typically delivered within 24 to 48 hours). Delivery outside Dhaka across any district is ৳130 (delivered within 3 to 5 business days). Orders above ৳2,500 qualify for promotional free standard delivery.'
  },
  {
    id: 'faq-3',
    category: 'Returns & Refunds',
    question: 'Can I check the product before receiving it?',
    answer: 'Yes! We encourage customers to inspect the outer parcel and verify the item contents in front of the delivery agent. If there is any visible defect, incorrect item, or missing part, you can refuse the parcel on the spot or contact our support within 24 hours.'
  },
  {
    id: 'faq-4',
    category: 'Returns & Refunds',
    question: 'What is the return & replacement procedure?',
    answer: 'We offer a hassle-free 7-day return policy for defective, damaged, or mismatched items. Just provide your Order ID and photos/video of the issue to our customer support via WhatsApp or email. Once verified, our courier will pick up the item and arrange an exchange or full refund.'
  },
  {
    id: 'faq-5',
    category: 'Payments',
    question: 'Which payment methods are supported?',
    answer: 'We support Cash on Delivery (COD), bKash, Nagad, Rocket, and domestic Visa/Mastercard debit and credit cards. When the website is connected to the merchant gateway, mobile wallet transactions are processed through secure encrypted channels.'
  },
  {
    id: 'faq-6',
    category: 'Orders & Delivery',
    question: 'How do I track my parcel once shipped?',
    answer: 'As soon as your order is confirmed and handed over to our courier partner (such as Steadfast, Pathao, or RedX), you receive an SMS with your Courier Consignment Tracking ID. You can also paste your Order ID into our "Track Order" page anytime for real-time status.'
  }
];
