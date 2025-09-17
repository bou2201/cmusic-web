declare namespace NodeJS {
  export interface ProcessEnv {
    readonly VERCEL_TOKEN: string;
    readonly VERCEL_ORG_ID: string;
    readonly VERCEL_PROJECT_ID: string;
    readonly VERCEL_PROJECT_PRODUCTION_URL: string;

    readonly NEXT_PUBLIC_API_URL: string;
  }
}
