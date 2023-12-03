'use client';

import { GoogleAuthProvider, getAuth, linkWithPopup, signInWithPopup } from "firebase/auth";
import { PropsWithChildren } from "react";

export interface GoogleLoginProps {
    onSuccess?(idToken: string): void;
}

export default function GoogleLogin({ children, onSuccess }: PropsWithChildren<GoogleLoginProps>) {
    return (
        <button
            onClick={async () => {
                const auth = getAuth();
                const provider = new GoogleAuthProvider();
                try {
                    const { user } = await signInWithPopup(auth, provider);
                    onSuccess && onSuccess(await user.getIdToken(true));
                } catch (error: any) {
                    /**
                     * @description 하나의 계정에 다른 인증 제공업체 연결
                     */
                    if (error.code === 'auth/account-exists-with-different-credential' && auth.currentUser) {
                        const { user } = await linkWithPopup(auth.currentUser, provider);
                        onSuccess && onSuccess(await user.getIdToken(true));
                    } else {
                        throw error;
                    }
                }
            }}
            style={{
                backgroundColor: 'white',
                fontSize: 16,
                height: 50,
                border: 'none',
                boxShadow: '0 2px 10px 2px #00000033',
                cursor: 'pointer',
            }}>
            {children}
        </button>
    )
}