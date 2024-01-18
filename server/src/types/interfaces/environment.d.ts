declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'test'| 'development' | 'production',
            HOST?: string;
            PORT?: string;
            DATABASE_URL?: string
            USER?: string
            PASSWORD?: string
            DB_HOST?: string
            DB_PORT?: string
            DATABASE?: string
            VERIFY_SECRET?: string
            REFRESH_SECRET?: string
            ACCESS_TOKEN?: string
            PASSWORD_RESET?: string
            SMTP_PASSWORD?: string
        }
    }
}

export {}