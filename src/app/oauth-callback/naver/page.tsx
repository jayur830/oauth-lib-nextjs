'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function NaverOAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        
        if (code) {
            sessionStorage.setItem('naver_authorize_code', code);
            router.replace('/');
        }
    }, [router, searchParams]);

    return <></>;
}
