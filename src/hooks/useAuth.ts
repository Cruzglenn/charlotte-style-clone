import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types/firebase';
import { setupUserOnSignup } from '@/utils/adminSetup';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  const createUserProfile = async (user: any, additionalData = {}) => {
    if (!user) return;
    
    // Create user profile with default customer role
    await setupUserOnSignup(user.uid, user.email);
    
    return doc(db, 'users', user.uid);
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await createUserProfile(result.user);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return { 
    user, 
    loading, 
    error, 
    register, 
    login, 
    signInWithGoogle,
    logout 
  };
};
