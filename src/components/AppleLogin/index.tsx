import { OAuthProvider, getAuth, linkWithPopup, signInWithPopup } from "firebase/auth";
import { PropsWithChildren } from "react";

export interface AppleLoginProps {
    onSuccess?(idToken: string): void;
}

export default function AppleLogin({ children, onSuccess }: PropsWithChildren<AppleLoginProps>) {
    return (
        <button
            onClick={async () => {
                const auth = getAuth();
                const provider = new OAuthProvider('apple.com');
                provider.addScope('email');
                provider.addScope('name');
                provider.setCustomParameters({ locale: 'ko' });
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
                            const { user } = await linkWithPopup(auth.currentUser, provider);
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
                backgroundColor: 'black',
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
