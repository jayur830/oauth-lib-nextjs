import { FacebookAuthProvider, getAuth, linkWithPopup, signInWithPopup } from "firebase/auth";
import { PropsWithChildren } from "react";

export interface FacebookLoginProps {
    onSuccess?(idToken: string): void;
}

export default function FacebookLogin({ children, onSuccess }: PropsWithChildren<FacebookLoginProps>) {
    return (
        <button
            onClick={async () => {
                const auth = getAuth();
                const provider = new FacebookAuthProvider();
                try {
                    const { user } = await signInWithPopup(auth, provider);
                    console.log('user:', user);
                    onSuccess && onSuccess(await user.getIdToken(true));
                } catch (error: any) {
                    /**
                     * @description 하나의 계정에 다른 인증 제공업체 연결
                     */
                    if (error.code === 'auth/account-exists-with-different-credential') {
                        if (auth.currentUser) {
                            console.log('email:', auth.currentUser.email);
                            const { user } = await linkWithPopup(auth.currentUser, provider);
                            console.log('user:', user);
                            onSuccess && onSuccess(await user.getIdToken(true));
                        } else {
                            alert('해당 이메일의 다른 계정이 이미 존재합니다. 이미 존재하는 계정으로 로그인 후 재로그인을 시도하세요.');
                        }
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
    );
}
