import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const makeUserAdmin = async (email: string) => {
  try {
    // Note: In a real app, you'd need to find the user by email first
    // For now, this is a utility function that requires the user ID
    console.log('To make a user admin:');
    console.log('1. Get the user ID from Firebase Auth console');
    console.log('2. Use the browser console to run:');
    console.log(`
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

const makeAdmin = async (userId) => {
  await updateDoc(doc(db, 'users', userId), { role: 'admin' });
  console.log('User is now admin!');
};

// Replace 'USER_ID_HERE' with the actual user ID
makeAdmin('USER_ID_HERE');
    `);
  } catch (error) {
    console.error('Error making user admin:', error);
  }
};

// Alternative: Admin promotion component for existing admins
export const promoteToAdmin = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, { role: 'admin' });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return false;
  }
};
