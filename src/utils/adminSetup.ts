import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const setupUserOnSignup = async (userId: string, email: string) => {
  try {
    // Check if user document already exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user document - temporarily making test user admin for testing
      const role = email === 'testuser@example.com' ? 'admin' : 'customer';
      await setDoc(userRef, {
        uid: userId,
        email: email,
        role: role, // Test user gets admin role for testing purposes
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        displayName: email.split('@')[0]
      });
      
      console.log(`User created with ${role} role`);
      return role === 'admin';
    } else {
      // Update last login and temporarily grant admin access to test user
      const updateData: any = {
        lastLogin: new Date()
      };
      
      if (email === 'testuser@example.com') {
        updateData.role = 'admin';
        console.log('Upgrading test user to admin for testing');
      }
      
      await setDoc(userRef, updateData, { merge: true });
    }
    
    return userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error setting up user:', error);
    return false;
  }
};
