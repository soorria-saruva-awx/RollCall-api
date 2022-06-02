declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AIRTABLE_API_KEY: string;
      AIRTABLE_ENDPOINT_URL: string;
      AIRTABLE_BASE_ID: string;
      AIRTABLE_GROUPED_VIEW_ID: string;
      AIRTABLE_TABLE_NAME: string;
    }
  }
}

export {};
