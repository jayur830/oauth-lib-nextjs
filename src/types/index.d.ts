declare global {
    namespace NodeJS {
      interface ProcessEnv {
        /** Client */
        NEXT_PUBLIC_API_URL: string;
        NEXT_PUBLIC_API_URL: string;
        NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY: string;
        NEXT_PUBLIC_NAVER_CLIENT_ID: string;
        NEXT_PUBLIC_FIREBASE_API_KEY: string
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
        NEXT_PUBLIC_FIREBASE_APP_ID: string
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string
        
        /** Server */
        API_URL: string;
        API_URL: string;
        KAKAO_JAVASCRIPT_KEY: string;
        NAVER_CLIENT_ID: string;
        FIREBASE_API_KEY: string
        FIREBASE_AUTH_DOMAIN: string
        FIREBASE_PROJECT_ID: string
        FIREBASE_STORAGE_BUCKET: string
        FIREBASE_MESSAGING_SENDER_ID: string
        FIREBASE_APP_ID: string
        FIREBASE_MEASUREMENT_ID: string
      }
    }
  }