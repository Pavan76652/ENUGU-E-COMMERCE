import { useState } from 'react';
import Animate from './Animate';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="border-t border-gray-100 py-14 sm:py-20">
      <div className="enugu-container">
        <Animate>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-enugu-gold">Newsletter</p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-enugu-black sm:text-3xl">
              Join The Drop List
            </h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Be first to know about new drops, exclusive releases, and members-only offers.
            </p>

            {submitted ? (
              <p className="mt-8 text-sm font-medium uppercase tracking-widest text-enugu-gold">
                You&apos;re on the list. Stay bold.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-enugu-gold"
                />
                <button type="submit" className="enugu-btn-primary shrink-0 px-8">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </Animate>
      </div>
    </section>
  );
};

export default Newsletter;
