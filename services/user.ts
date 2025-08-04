import React, { createContext, useState, useEffect, useContext } from 'react';
import { User as AppUser, Gender, FitnessGoal, FitnessLevel } from '../types';
import { auth, db } from './firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';


const createNewUserProfile = (firebaseUser: FirebaseUser): AppUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    onboardingCompleted: false,
    age: 25,
    gender: Gender.PreferNotToSay,
    currentWeight: 70,
    fitnessGoal: FitnessGoal.Maintain,
    fitnessLevel: FitnessLevel.Beginner,
    equipment: [],
    muscleGroups: [],
    meditationHours: 0,
    streak: 0,
    workoutSessions: 0,
    quizScore: 0,
    memoryScore: 0,
    wordsearchScore: 0,
    sudokuScore: 0,
    checkersScore: 0,
    chessScore: 0,
    brainGymScore: 0,
    customWorkoutPlan: {},
    workoutLogs: [],
    weightHistory: [],
});

interface UserContextType {
    user: AppUser | null;
    setUser: (user: AppUser | null) => void;
    saveUser: (user: AppUser) => Promise<void>;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    saveUser: async () => {},
    loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserState(userSnap.data() as AppUser);
                } else {
                    const newUserProfile = createNewUserProfile(firebaseUser);
                    await setDoc(userRef, newUserProfile);
                    setUserState(newUserProfile);
                }
            } else {
                setUserState(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSetUser = (newUser: AppUser | null) => {
        setUserState(newUser);
    };

    const saveUser = async (userToSave: AppUser) => {
        if (!userToSave.uid) {
            console.error("Attempted to save user without a UID.");
            return;
        }
        const userRef = doc(db, 'users', userToSave.uid);
        await setDoc(userRef, userToSave, { merge: true });
        setUserState(userToSave);
    };
    
    return React.createElement(UserContext.Provider, { value: { user, setUser: handleSetUser, saveUser, loading } }, children);
};

export const useUser = () => useContext(UserContext);

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw new Error('Failed to sign in with Google.');
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        window.location.hash = '/login';
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export const login = async (): Promise<AppUser> => {
    throw new Error("Email/password login is not supported. Please use Google Sign-In.");
};

export const signup = async (): Promise<AppUser> => {
     throw new Error("Email/password signup is not supported. Please use Google Sign-In.");
};

export const logout = signOutUser;