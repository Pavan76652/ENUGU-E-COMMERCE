import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../config/logger.js';

let transporter = null;

const getTransporter = () => {
  if (!env.email.isConfigured) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  return transporter;
};

const wrapHtml = (title, bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
    <h1 style="font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">ENUGU</h1>
    <h2 style="font-size: 16px; margin-top: 24px;">${title}</h2>
    ${bodyHtml}
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
    <p style="font-size: 12px; color: #888;">ENUGU — Made to Stand Out</p>
  </div>
`;

/**
 * Sends an email through SMTP when configured. In development without SMTP it
 * logs the message so flows remain testable; in production it warns.
 */
const sendMail = async ({ to, subject, text, html, context = 'email' }) => {
  const mailer = getTransporter();

  if (!mailer) {
    if (env.isDevelopment) {
      logger.info({ to, subject, context }, `[dev] ${context} (SMTP not configured)`);
      return { delivered: false, devMode: true };
    }
    logger.warn({ to, context }, `${context} not sent — SMTP not configured`);
    return { delivered: false, devMode: false };
  }

  try {
    const info = await mailer.sendMail({
      from: env.email.from,
      to,
      subject,
      text,
      html,
    });
    logger.info({ to, subject, messageId: info.messageId, context }, `${context} sent`);
    return { delivered: true, devMode: false, messageId: info.messageId };
  } catch (error) {
    logger.error({ err: error, to, context }, `${context} failed to send`);
    return { delivered: false, devMode: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async ({ email, firstName, resetToken }) => {
  const resetUrl = `${env.clientUrl}/reset-password?token=${resetToken}`;
  const subject = 'ENUGU — Reset Your Password';
  const text = `Hi ${firstName},\n\nYou requested a password reset for your ENUGU account.\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, ignore this email.\n\n— ENUGU\nMade to Stand Out`;
  const html = wrapHtml(
    'Reset your password',
    `<p>Hi ${firstName},</p>
     <p>You requested a password reset for your ENUGU account.</p>
     <p><a href="${resetUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;">Reset password</a></p>
     <p style="font-size:13px;color:#666;">This link expires in 1 hour. If you did not request this, ignore this email.</p>`
  );

  const result = await sendMail({ to: email, subject, text, html, context: 'Password reset email' });
  return env.isDevelopment ? { ...result, resetUrl } : result;
};

export const sendEmailVerification = async ({ email, firstName, verifyToken }) => {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${verifyToken}`;
  const subject = 'ENUGU — Verify Your Email';
  const text = `Hi ${firstName},\n\nWelcome to ENUGU! Please verify your email address.\n\nVerify: ${verifyUrl}\n\nThis link expires in 24 hours.\n\n— ENUGU\nMade to Stand Out`;
  const html = wrapHtml(
    'Verify your email',
    `<p>Hi ${firstName},</p>
     <p>Welcome to ENUGU! Please confirm your email address to secure your account.</p>
     <p><a href="${verifyUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;">Verify email</a></p>
     <p style="font-size:13px;color:#666;">This link expires in 24 hours.</p>`
  );

  const result = await sendMail({ to: email, subject, text, html, context: 'Email verification' });
  return env.isDevelopment ? { ...result, verifyUrl } : result;
};

export const sendOrderConfirmationEmail = async ({ email, firstName, order }) => {
  if (!email || !order) return { delivered: false };

  const itemsText = order.items
    .map((item) => `  • ${item.name} (${item.size}) × ${item.quantity} — ₹${item.totalPrice}`)
    .join('\n');

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;">${item.name} (${item.size}) × ${item.quantity}</td><td style="padding:6px 0;text-align:right;">₹${item.totalPrice}</td></tr>`
    )
    .join('');

  const subject = `ENUGU — Order ${order.orderNumber} confirmed`;
  const text = `Hi ${firstName ?? 'there'},\n\nThanks for your order! We've received order ${order.orderNumber}.\n\n${itemsText}\n\nTotal: ₹${order.pricing.total}\nPayment: ${order.paymentMethod.toUpperCase()}\n\nTrack your order: ${env.clientUrl}/orders/${order.orderNumber}\n\n— ENUGU\nMade to Stand Out`;
  const html = wrapHtml(
    `Order ${order.orderNumber} confirmed`,
    `<p>Hi ${firstName ?? 'there'},</p>
     <p>Thanks for your order! Here's a summary:</p>
     <table style="width:100%;border-collapse:collapse;font-size:14px;">${itemsHtml}
       <tr><td style="padding-top:12px;border-top:1px solid #eee;font-weight:bold;">Total</td>
       <td style="padding-top:12px;border-top:1px solid #eee;text-align:right;font-weight:bold;">₹${order.pricing.total}</td></tr>
     </table>
     <p style="font-size:13px;color:#666;">Payment method: ${order.paymentMethod.toUpperCase()}</p>
     <p><a href="${env.clientUrl}/orders/${order.orderNumber}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;">Track order</a></p>`
  );

  return sendMail({ to: email, subject, text, html, context: 'Order confirmation' });
};

export const sendBackInStockEmail = async ({ email, productName, productSlug, size, price }) => {
  const productUrl = `${env.clientUrl}/product/${productSlug}`;
  const sizeLine = size ? `Size ${size} is` : 'This item is';
  const subject = `ENUGU — ${productName} is back in stock`;
  const text = `Hi,\n\nGood news! ${sizeLine} back in stock at ENUGU.\n\n${productName}${price ? ` — ₹${price}` : ''}\n\nShop now: ${productUrl}\n\n— ENUGU\nWear Your Identity`;
  const html = wrapHtml(
    `${productName} is back`,
    `<p>Good news! ${sizeLine} back in stock.</p>
     <p><strong>${productName}</strong>${price ? ` — ₹${price}` : ''}</p>
     <p><a href="${productUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;">Shop now</a></p>`
  );

  return sendMail({ to: email, subject, text, html, context: 'Back in stock email' });
};

export const sendContactFormEmail = async ({ name, email, phone, subject, message }) => {
  const notifyTo = env.superAdmin?.email || env.email.from;
  const mailSubject = `ENUGU Contact — ${subject}`;
  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n— ENUGU Contact Form`;
  const html = wrapHtml(
    'New contact form submission',
    `<p><strong>Name:</strong> ${name}</p>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Phone:</strong> ${phone || '—'}</p>
     <p><strong>Subject:</strong> ${subject}</p>
     <p><strong>Message:</strong></p>
     <p style="white-space:pre-wrap;">${message}</p>`
  );

  return sendMail({
    to: notifyTo,
    subject: mailSubject,
    text,
    html,
    context: 'Contact form email',
  });
};

export default {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendOrderConfirmationEmail,
  sendBackInStockEmail,
  sendContactFormEmail,
};
