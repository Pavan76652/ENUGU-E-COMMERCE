import { ContactInfo, ContactForm, ContactActions } from '../../components/contact';
import { Seo } from '../../components/seo';
import { PAGE_SEO } from '../../utils/seo';

const ContactPage = () => (
  <>
    <Seo {...PAGE_SEO.contact} />
  <div className="py-8 sm:py-12 lg:py-16">
    <div className="enugu-container">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Get In Touch</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
          Questions about orders, custom designs, or our drops? Reach out — we&apos;re here to help.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:mt-14 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">
            Contact Details
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Prefer a quick chat? Message or call us directly.
          </p>

          <div className="mt-6">
            <ContactInfo />
          </div>

          <div className="mt-8">
            <ContactActions />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">
              Send a Message
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Fill out the form and we&apos;ll respond within 24–48 hours.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
);

export default ContactPage;
