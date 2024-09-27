import { openai } from "../../config/openai.js";
import schema from "../data/schema.json" assert { type: "json" };
import mammoth from "mammoth";

async function extract(buffer) {
  const result = await mammoth.extractRawText({ buffer: buffer });
  return result.value;
}
export const resumeToJson = async (buffer) => {
  const text = await extract(buffer);
  const prompt = `
Given a resume provided below, 
convert it to a JSON object using the schema provided. 

The resume: ${text}
The schema: ${JSON.stringify(schema)}
Only return the JSON response. `;
  try {
    console.log("\n\n\n\nPrompt:", prompt);
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 10000,
    });
    const updatedText = gptResponse.choices[0]?.message?.content;
    const jsonMatch = updatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonResponse = jsonMatch[0];
      return JSON.parse(jsonResponse);
    }
    throw new Error("No JSON found in the response");
  } catch (error) {
    console.error("Error in resumeToJson function:", error);
    throw error;
  }
};
