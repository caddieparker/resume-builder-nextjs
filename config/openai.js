import OpenAI from "openai";

export const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  project: process.env.PROJECT_ID,
  apiKey: process.env.OPEN_AI_API_KEY,
});
