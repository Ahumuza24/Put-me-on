import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase.client';
import { profileStorage, type UserProfile } from '~/lib/profile-storage';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<{ error: any }>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async (userId: string) => {
        try {
            console.log('Loading profile for user:', userId);
            const userProfile = await profileStorage.getByUserId(userId);
            console.log('Loaded profile:', userProfile);
            setProfile(userProfile);
        } catch (error) {
            console.error('Error loading profile:', error);
            setProfile(null);
        } finally {
            // Ensure loading is set to false after profile load attempt
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await loadProfile(user.id);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        // Set a timeout to prevent infinite loading
        const loadingTimeout = setTimeout(() => {
            if (isMounted) {
                console.log('Loading timeout reached, setting loading to false');
                setLoading(false);
            }
        }, 10000); // 10 second timeout

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isMounted) return;
            
            setUser(session?.user ?? null);
            if (session?.user) {
                await loadProfile(session.user.id);
            }
            setLoading(false);
            clearTimeout(loadingTimeout);
        }).catch((error) => {
            console.error('Error getting session:', error);
            if (isMounted) {
                setLoading(false);
                clearTimeout(loadingTimeout);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return;
                
                setUser(session?.user ?? null);
                if (session?.user) {
                    await loadProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
                clearTimeout(loadingTimeout);
            }
        );

        return () => {
            isMounted = false;
            clearTimeout(loadingTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        // Don't try to load profile immediately after signup
        // The profile will be created by the signup component
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};