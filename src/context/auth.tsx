"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseClientApp";
import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  currentUser: User | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ?? null);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

// const auth = useAuth()
// auth.loginWithGoogle()
// auth.currentUser
