import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../../services/authApi';
import {
  setCredentials,
  clearCredentials,
  selectAccessToken,
  selectUser,
} from '../../store/slices/authSlice';

const AuthLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-enugu-black border-t-transparent" />
      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ENUGU</p>
    </div>
  </div>
);

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const user = useSelector(selectUser);
  // The access token lives only in memory, so on a fresh page load it is gone.
  // We attempt a silent refresh using the httpOnly refresh cookie to restore the
  // session before rendering protected routes. If already authenticated in this
  // session (e.g. just logged in), skip the round-trip.
  const [ready, setReady] = useState(() => Boolean(token && user));

  useEffect(() => {
    if (token && user) {
      setReady(true);
      return undefined;
    }

    let active = true;

    authApi
      .refreshToken()
      .then((res) => {
        const payload = res.data ?? res;
        if (active && payload?.accessToken && payload?.user) {
          dispatch(
            setCredentials({ user: payload.user, accessToken: payload.accessToken })
          );
        } else if (active) {
          dispatch(clearCredentials());
        }
      })
      .catch(() => {
        if (active) dispatch(clearCredentials());
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
    // Runs once on mount — silent refresh attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!ready) {
    return <AuthLoader />;
  }

  return children;
};

export default AuthInitializer;
