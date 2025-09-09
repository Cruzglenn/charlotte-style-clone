import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from './useUserRole';

export const useAuthRedirect = () => {
  const { isAdmin, user, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      // Auto-redirect admin users to admin panel
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/admin')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAdmin, user, loading, navigate]);

  return { isAdmin, user, loading };
};
