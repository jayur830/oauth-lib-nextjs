'use client';

import { AppleLogin, FacebookLogin, NaverLogin } from "@/components";
import GoogleLogin from "@/components/GoogleLogin";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { useCallback, useEffect } from "react";
import KakaoLogin from 'react-kakao-login';

initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export default function Home() {
  /**
   * @description ID Token을 통해 백엔드에서 서비스 유저 생성
   * @param idToken Firebase ID Token
   */
  const signIn = useCallback(async (idToken: string) => {
    const userClaims = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {
        Authorization: idToken,
      }
    }).then(response => response.json());
    console.log('firebase user claims and id token:', userClaims, await getAuth().currentUser?.getIdToken(true));
  }, []);

  useEffect(() => {
    getAuth().onAuthStateChanged(async user => {
      console.log(await user?.getIdToken(true));
    })
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 222 }}>
      {/* 로그아웃 */}
      <button onClick={() => {
        signOut(getAuth());
      }}>logout</button>
      {/* 구글 로그인 */}
      <GoogleLogin onSuccess={signIn}>
        <span style={{ color: '#EA4335' }}>구글</span>
        <span style={{ color: '#FBBC05' }}>로 </span>
        <span style={{ color: '#34A853' }}>로그인</span>
        <span style={{ color: '#4285F4' }}>하기</span>
      </GoogleLogin>
      {/* 페이스북 로그인 */}
      <FacebookLogin onSuccess={signIn}>
        페이스북으로 로그인하기
      </FacebookLogin>
      {/* 애플 로그인 */}
      <AppleLogin onSuccess={signIn}>
        애플로 로그인하기
      </AppleLogin>
      {/* 카카오 로그인 */}
      <KakaoLogin
        token={process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || ''}
        onSuccess={async ({ response }) => {
          console.log('kakao response:', response);

          /**
           * @description 백엔드 API 내에서 카카오 프로필 조회, Custom token 응답
           */
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`, {
            method: 'POST',
            headers: {
              Authorization: response.access_token,
            },
          }).then(response => response.json());
          console.log('custom token responsed by kakao login:', result);

          const { user } = await signInWithCustomToken(getAuth(), result.token);
          const idToken = await user.getIdToken(true);
          signIn(idToken);
        }}
        onFail={console.log}
        render={props => (
          <button
            style={{
              fontSize: 16,
              backgroundColor: '#FFEB00',
              height: 50,
              border: 'none',
              cursor: 'pointer',
            }}
            {...props}>
            카카오로 로그인하기
          </button>
        )}
      />
      {/* 네이버 로그인 */}
      <NaverLogin
        clientId={process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || ''}
        redirectUri={`${process.env.NEXT_PUBLIC_ORIGIN}/oauth-callback/naver`}
        onSuccess={async code => {
          console.log('naver authorization code:', code);

          /**
           * @description 백엔드 API 내에서 네이버 프로필 조회, Custom token 응답
           */
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/naver`, {
            method: 'POST',
            headers: {
              Authorization: code,
            },
          }).then(response => response.json());
          console.log('custom token responsed by naver login:', result);

          const { user } = await signInWithCustomToken(getAuth(), result.token);
          const idToken = await user.getIdToken(true);
          signIn(idToken);
        }}
      >
        네이버로 로그인하기
      </NaverLogin>
    </div>
  )
}
