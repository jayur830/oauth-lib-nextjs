import { FacebookAuthProvider, getAuth, linkWithPopup, signInWithPopup } from "firebase/auth";
import { PropsWithChildren } from "react";

export interface FacebookLoginProps {
    onSuccess?(idToken: string): void;
}

export default function FacebookLogin({ children, onSuccess }: PropsWithChildren<FacebookLoginProps>) {
    return (
        <>
            <button
                onClick={async () => {
                    const auth = getAuth();
                    const provider = new FacebookAuthProvider();
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
                    backgroundColor: '#4267B2',
                    fontSize: 16,
                    color: 'white',
                    height: 50,
                    border: 'none',
                    cursor: 'pointer',
                }}>
                {children}
            </button>
        </>
    );
}
