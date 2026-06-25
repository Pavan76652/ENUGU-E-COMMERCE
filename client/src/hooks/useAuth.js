import { useSelector, useDispatch } from 'react-redux';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const dispatch = useDispatch();

  return { ...auth, user, isAuthenticated, role, dispatch };
};

export default useAuth;
