import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './config';

interface FirebaseAuthContextType {
  currentUser: User | null;
  isAuthReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isSyncing: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);

      if (user) {
        // Sync or create user profile document in Firestore
        try {
          setIsSyncing(true);
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          if (!snap.exists()) {
            await setDoc(userDocRef, {
              id: user.uid,
              name: user.displayName || 'HSC পরীক্ষার্থী',
              email: user.email || '',
              examTarget: 'HSC 2026',
              group: 'বিজ্ঞান',
              dailyTargetHours: 6,
              preferredTime: 'রাত ৮:০০ - রাত ১১:০০',
              notificationsEnabled: true,
              theme: 'light',
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Error syncing user profile with Firestore:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSyncing(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out Error:', error);
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        currentUser,
        isAuthReady,
        signInWithGoogle,
        signOutUser,
        isSyncing,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
