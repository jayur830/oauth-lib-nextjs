'use client';

import { AppleLogin, FacebookLogin, NaverLogin } from "@/components";
import GoogleLogin from "@/components/GoogleLogin";
import { AuthProvider } from "@/enums";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { useCallback, useEffect } from "react";
import KakaoLogin from 'react-kakao-login';

if (getApps().length) {
  getApp();
} else {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
}

/**
 * @description Custom Claims를 적용할 서비스 Key를 입력합니다.
 * @example const service = 'cliping';
 */
const service = 'cliping';

export default function Home() {
  /**
   * @description ID Token을 통해 백엔드에서 서비스 유저 생성
   * @param idToken Firebase ID Token
   */
  const setCustomClaims = useCallback(async (idToken: string, provider: AuthProvider) => {
    /**
     * @description Custom Claims 조회
     */
    const customClaims = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims`, {
      method: 'POST',
      headers: {
        Authorization: idToken,
      },
    }).then(response => response.json());
    console.log('customClaims:', customClaims);

    /**
     * @description Custom Claims 수정
     */
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/update`, {
      method: 'PUT',
      headers: {
        Authorization: idToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customClaims,
        [service]: {
          providers: [...new Set([...customClaims[service]?.providers, provider])].sort(),
        },
      })
    });

    /**
     * @description Custom Claims를 업데이트한 후에는 idToken을 refresh하여 사용해야 합니다.
     * 위에서 적용한 Claims를 기존의 idToken으로는 조회할 수 없기 때문입니다.
     */
    getAuth().currentUser?.getIdToken(true);
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
      <GoogleLogin
        onSuccess={idToken => {
          setCustomClaims(idToken, AuthProvider.GOOGLE);
        }}>
        <span style={{ color: '#EA4335' }}>구글</span>
        <span style={{ color: '#FBBC05' }}>로 </span>
        <span style={{ color: '#34A853' }}>로그인</span>
        <span style={{ color: '#4285F4' }}>하기</span>
      </GoogleLogin>
      {/* 페이스북 로그인 */}
      <FacebookLogin
        onSuccess={idToken => {
          setCustomClaims(idToken, AuthProvider.FACEBOOK);
        }}>
        페이스북으로 로그인하기
      </FacebookLogin>
      {/* 애플 로그인 */}
      <AppleLogin
        onSuccess={idToken => {
          setCustomClaims(idToken, AuthProvider.APPLE);
        }}>
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
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/kakao/${service}`, {
            method: 'POST',
            headers: {
              Authorization: response.access_token,
            },
          }).then(response => response.json());
          console.log('custom token responsed by kakao login:', result);

          const { user } = await signInWithCustomToken(getAuth(), result.token);
          const idToken = await user.getIdToken(true);
          setCustomClaims(idToken, AuthProvider.KAKAO);
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
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/naver/${service}`, {
            method: 'POST',
            headers: {
              Authorization: code,
            },
          }).then(response => response.json());
          console.log('custom token responsed by naver login:', result);

          const { user } = await signInWithCustomToken(getAuth(), result.token);
          const idToken = await user.getIdToken(true);
          setCustomClaims(idToken, AuthProvider.NAVER);
        }}
      >
        네이버로 로그인하기
      </NaverLogin>
    </div>
  )
}
