namespace NodeJS{
  interface ProcessEnv{
    //!App
    PORT:number
    //!DB
    DB_PORT:number
    DB_NAME:string
    DB_USERNAME:string
    DB_PASSWORD:string
    DB_HOST:string

    //! ACCSES_TOKEN
    REFRESH_TOKEN_SECRET:string
    ACSSES_TOKEN_SECRET:string

    //!ZarinPal
  ZARINPAL_VERIFAY_URL:string
  ZARINPAL_RREQEST_URL:string
  ZARINPAL_GETWAY_URL:string
  ZARINPAL_MERCHENT_ID:string
  }
}