import resume from "../data/resume.json" assert { type: "json" };
import { openai } from "../../config/openai.js";
import { Packer } from "docx";
import { generateResumeDocx } from "../services/generateResume";
import { outputPrompt } from "../data/prompts";

export const updateResume = async (jobDescription, companyValues) => {
  try {
    let updatedResume = { ...resume };
    console.log("Starting resume update...");

    const prompt = `${outputPrompt}
  Input Data:

  Position: Product Manager
  Company Values: ${companyValues}
  Base Resume (in JSON): ${JSON.stringify(updatedResume)}
  Job Description: ${jobDescription} 
  Expected Output:

  1. A JSON of the updated resume matching the syntax of the base resume.
  2. A detailed explaination of what you updated and why. 
  `;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 4096,
    });

    const updatedText = gptResponse.choices[0]?.message?.content;

    if (!updatedText) {
      throw new Error("No content in GPT response");
    }

    const jsonMatch = updatedText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        let afterJsonContent = "";
        const jsonData = JSON.parse(jsonMatch[0]);
        const afterJson = updatedText.split(jsonMatch[0])[1];
        afterJsonContent = afterJson ? afterJson.trim() : "";

        console.log("Content after JSON:", afterJsonContent);
        const docBuffer = await generateResumeDocx(jsonData);
        console.log("DOCX file created successfully");
        return { buffer: docBuffer };
      } catch (error) {
        console.error("Error parsing JSON or creating DOCX:", error);
        throw error;
      }
    } else {
      console.error("No JSON found in the GPT response");
      throw new Error("No JSON found in the response");
    }
  } catch (error) {
    console.error("Error in updateResume function:", error);
    throw error;
  }
};
