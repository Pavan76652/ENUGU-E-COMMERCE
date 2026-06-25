import ContactMessage from '../models/ContactMessage.js';
import { CONTACT_MESSAGE_STATUS } from '../constants/contactStatus.js';
import { sendContactFormEmail } from './email.service.js';

export const submitContactMessage = async (data, userId = null) => {
  const message = await ContactMessage.create({
    userId: userId ?? undefined,
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone?.trim() || '',
    subject: data.subject.trim(),
    message: data.message.trim(),
    status: CONTACT_MESSAGE_STATUS.NEW,
  });

  await sendContactFormEmail({
    name: message.name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
  });

  return message;
};

export default { submitContactMessage };
