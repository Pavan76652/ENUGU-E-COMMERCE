import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { AuthFooterLinks, AuthLink } from '../../components/auth';
import { ROUTES } from '../../config/routes';

const STATUS = {
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
};

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? STATUS.VERIFYING : STATUS.ERROR);
  const [message, setMessage] = useState(
    token ? 'Verifying your email…' : 'This verification link is invalid or missing.'
  );
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;

    authApi
      .verifyEmail({ token })
      .then((res) => {
        setStatus(STATUS.SUCCESS);
        setMessage(res?.message || 'Your email has been verified.');
      })
      .catch((err) => {
        setStatus(STATUS.ERROR);
        setMessage(
          err.response?.data?.message || 'This verification link is invalid or expired.'
        );
      });
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">
        {status === STATUS.SUCCESS ? 'Email Verified' : 'Verify Email'}
      </h1>
      <p className="mt-3 text-sm text-gray-600">{message}</p>

      {status === STATUS.VERIFYING && (
        <div className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-enugu-black border-t-transparent" />
      )}

      <AuthFooterLinks>
        {status === STATUS.SUCCESS ? (
          <AuthLink to={ROUTES.LOGIN}>Continue to sign in</AuthLink>
        ) : (
          status !== STATUS.VERIFYING && <AuthLink to={ROUTES.LOGIN}>Back to sign in</AuthLink>
        )}
      </AuthFooterLinks>
    </div>
  );
};

export default VerifyEmailPage;
