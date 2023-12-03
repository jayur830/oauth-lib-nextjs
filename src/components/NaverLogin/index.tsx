import { PropsWithChildren, useEffect } from "react";

export interface NaverLoginProps {
    clientId: string;
    redirectUri: string;
    onSuccess?(code: string): void;
}

export default function NaverLogin({ children, clientId, redirectUri, onSuccess }: PropsWithChildren<NaverLoginProps>) {
    useEffect(() => {
        const code = sessionStorage.getItem('naver_authorize_code');
        sessionStorage.removeItem('naver_authorize_code');
        if (code && onSuccess) {
            onSuccess(code);
        }
    }, [onSuccess]);

    return (
        <a
            href={`https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#00C63B',
                color: 'white',
                fontSize: 16,
                textDecoration: 'none',
                height: 50,
            }}>
            {children}
        </a>
    )
}