import env from '../../config/env';
import {
  formatDisplayPhone,
  formatTelLink,
  getWhatsAppUrl,
  getInstagramHandle,
} from '../../utils/contactHelpers';

const ContactInfo = () => {
  const phone = formatDisplayPhone(env.supportPhone);
  const whatsapp = formatDisplayPhone(env.whatsappNumber);
  const instagramHandle = getInstagramHandle();

  const items = [
    {
      label: 'Business Phone',
      value: phone,
      href: formatTelLink(env.supportPhone),
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      ),
    },
    {
      label: 'WhatsApp',
      value: whatsapp,
      href: getWhatsAppUrl(),
      external: true,
      icon: (
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      ),
      fill: true,
    },
    {
      label: 'Email',
      value: env.supportEmail,
      href: `mailto:${env.supportEmail}`,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
    },
    {
      label: 'Instagram',
      value: instagramHandle,
      href: env.instagramUrl,
      external: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm4.5-1.5a1 1 0 100-2 1 1 0 000 2zM7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className="flex items-start gap-4 rounded border border-gray-200 bg-white p-4 transition hover:border-enugu-gold"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-enugu-gold/10 text-enugu-gold">
            <svg
              className="h-5 w-5"
              fill={item.fill ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke={item.fill ? 'none' : 'currentColor'}
              aria-hidden
            >
              {item.icon}
            </svg>
          </span>
          <span>
            <span className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              {item.label}
            </span>
            <span className="mt-1 block text-sm font-medium text-enugu-black">{item.value}</span>
          </span>
        </a>
      ))}
    </div>
  );
};

export default ContactInfo;
