import Airtable from "airtable";

export const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
    endpointUrl: process.env.AIRTABLE_ENDPOINT_URL,
});
