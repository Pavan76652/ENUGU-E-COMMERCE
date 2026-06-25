import env from '../config/env';
import { ROUTES } from '../config/routes';

const supportEmail = env.supportEmail;
const freeShipping = env.freeShippingThreshold;

export const LEGAL_PAGES = {
  privacy: {
    slug: 'privacy-policy',
    path: ROUTES.PRIVACY_POLICY,
    title: 'Privacy Policy',
    metaDescription:
      'Learn how ENUGU collects, uses, and protects your personal information when you shop with us.',
    lastUpdated: 'June 2025',
    sections: [
      {
        heading: 'Introduction',
        body: `ENUGU ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.`,
      },
      {
        heading: 'Information We Collect',
        body: `We may collect: name, email address, phone number, shipping and billing addresses, order history, payment-related information (processed securely via payment partners), account credentials, and communications you send us (including contact form and custom design requests). We also collect technical data such as IP address, browser type, and device information through cookies and analytics.`,
      },
      {
        heading: 'How We Use Your Information',
        body: `We use your information to process orders, deliver products, provide customer support, send order updates, improve our website and products, prevent fraud, and — with your consent — send marketing communications about new drops and offers.`,
      },
      {
        heading: 'Sharing of Information',
        body: `We do not sell your personal data. We may share information with trusted service providers (payment gateways, shipping partners, email services, cloud hosting) solely to operate our business. We may disclose information if required by law or to protect our rights.`,
      },
      {
        heading: 'Data Security',
        body: `We implement appropriate technical and organisational measures to protect your data. However, no method of transmission over the internet is 100% secure.`,
      },
      {
        heading: 'Your Rights',
        body: `You may request access, correction, or deletion of your personal data by contacting us at ${supportEmail}. You may opt out of marketing emails at any time.`,
      },
      {
        heading: 'Cookies',
        body: `We use cookies to remember preferences, keep you logged in, and understand site usage. You can control cookies through your browser settings.`,
      },
      {
        heading: 'Contact',
        body: `For privacy-related questions, email ${supportEmail}.`,
      },
    ],
  },
  terms: {
    slug: 'terms-and-conditions',
    path: ROUTES.TERMS,
    title: 'Terms & Conditions',
    metaDescription:
      'Read the terms and conditions for using the ENUGU website and purchasing premium streetwear.',
    lastUpdated: 'June 2025',
    sections: [
      {
        heading: 'Agreement',
        body: `By accessing enugu.com or placing an order, you agree to these Terms & Conditions. If you do not agree, please do not use our services.`,
      },
      {
        heading: 'Products & Pricing',
        body: `All products are subject to availability. We reserve the right to modify prices, descriptions, and images without prior notice. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.`,
      },
      {
        heading: 'Orders & Acceptance',
        body: `Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order (e.g. stock unavailability, pricing errors, suspected fraud). You will receive an order confirmation email once your order is accepted.`,
      },
      {
        heading: 'Account Responsibility',
        body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.`,
      },
      {
        heading: 'Intellectual Property',
        body: `All content on this website — including logos, designs, images, and text — is owned by ENUGU or its licensors. You may not reproduce, distribute, or use our content without written permission.`,
      },
      {
        heading: 'Limitation of Liability',
        body: `To the fullest extent permitted by law, ENUGU shall not be liable for indirect, incidental, or consequential damages arising from use of our website or products.`,
      },
      {
        heading: 'Governing Law',
        body: `These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in India.`,
      },
      {
        heading: 'Contact',
        body: `Questions about these terms? Email ${supportEmail}.`,
      },
    ],
  },
  refund: {
    slug: 'refund-policy',
    path: ROUTES.REFUND_POLICY,
    title: 'Refund Policy',
    metaDescription:
      'ENUGU refund policy for orders, cancellations, and payment issues on premium streetwear purchases.',
    lastUpdated: 'June 2025',
    sections: [
      {
        heading: 'Overview',
        body: `We want you to love your ENUGU gear. This Refund Policy explains when refunds are issued for orders placed on our website.`,
      },
      {
        heading: 'Eligible Refunds',
        body: `Refunds may be issued when: (1) we cancel your order due to stock unavailability; (2) you receive a defective or wrong item (see Return Policy); (3) a duplicate payment was charged; or (4) we are unable to fulfil your order.`,
      },
      {
        heading: 'Non-Refundable Situations',
        body: `Refunds are not provided for: change of mind after delivery window; items damaged due to misuse; custom-made products unless defective; or orders marked as delivered with valid proof of delivery.`,
      },
      {
        heading: 'Refund Method & Timeline',
        body: `Approved refunds are processed to the original payment method. For Cash on Delivery orders, refunds are issued via bank transfer or UPI after verification. Refunds typically appear within 5–10 business days depending on your bank or payment provider.`,
      },
      {
        heading: 'Order Cancellation',
        body: `You may cancel an order before it is packed by contacting us at ${supportEmail} or via WhatsApp. Once shipped, cancellation is not possible — please refer to our Return Policy.`,
      },
      {
        heading: 'Contact',
        body: `For refund requests, email ${supportEmail} with your order number and reason.`,
      },
    ],
  },
  shipping: {
    slug: 'shipping-policy',
    path: ROUTES.SHIPPING_POLICY,
    title: 'Shipping Policy',
    metaDescription:
      'ENUGU shipping rates, delivery timelines, and free shipping on orders above ₹999 across India.',
    lastUpdated: 'June 2025',
    sections: [
      {
        heading: 'Shipping Areas',
        body: `We currently ship across India. Delivery to certain remote pin codes may take additional time.`,
      },
      {
        heading: 'Processing Time',
        body: `Orders are typically processed within 1–3 business days after confirmation. Custom design orders may require additional production time communicated at quotation.`,
      },
      {
        heading: 'Delivery Timeline',
        body: `Standard delivery takes 3–7 business days after dispatch, depending on your location. You will receive tracking information once your order ships.`,
      },
      {
        heading: 'Shipping Charges',
        body: `Free standard shipping on orders above ₹${freeShipping}. Orders below ₹${freeShipping} may incur a flat shipping fee displayed at checkout.`,
      },
      {
        heading: 'Order Tracking',
        body: `Track your order from your account orders page or via the tracking link sent by email/SMS when your package is dispatched.`,
      },
      {
        heading: 'Delivery Issues',
        body: `If your package is delayed, lost, or arrives damaged, contact us within 48 hours of the expected delivery date at ${supportEmail}.`,
      },
    ],
  },
  return: {
    slug: 'return-policy',
    path: ROUTES.RETURN_POLICY,
    title: 'Return Policy',
    metaDescription:
      'How to return or exchange ENUGU streetwear items. Size exchanges and defective product returns explained.',
    lastUpdated: 'June 2025',
    sections: [
      {
        heading: 'Return Window',
        body: `You may request a return or exchange within 7 days of delivery for unused items with original tags and packaging intact.`,
      },
      {
        heading: 'Eligible Returns',
        body: `Returns are accepted for: wrong size (exchange subject to stock), defective or damaged items, wrong product shipped, or manufacturing defects. Items must be unworn, unwashed, and in resaleable condition.`,
      },
      {
        heading: 'Non-Returnable Items',
        body: `We cannot accept returns for: custom-designed products (unless defective), items without tags, worn or washed products, or products purchased during final sale unless defective.`,
      },
      {
        heading: 'How to Initiate a Return',
        body: `Email ${supportEmail} or message us on WhatsApp with your order number, item details, and photos (if defective). Our team will provide return instructions and a pickup or drop-off address.`,
      },
      {
        heading: 'Exchanges',
        body: `Size exchanges are subject to availability. If your preferred size is out of stock, you may choose an alternative product or receive a refund as per our Refund Policy.`,
      },
      {
        heading: 'Return Shipping',
        body: `For approved defective/wrong-item returns, ENUGU covers return shipping. For size exchanges or change-of-mind returns (where applicable), return shipping may be borne by the customer unless otherwise stated.`,
      },
    ],
  },
};

export const LEGAL_PAGE_LIST = Object.values(LEGAL_PAGES);

export default LEGAL_PAGES;
