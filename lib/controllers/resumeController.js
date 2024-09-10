import resume from "../data/resume.json" assert { type: "json" };
import { openai } from "../../config/openai.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const updateResume = async (jobDescription, companyValues) => {
  try {
    let updatedResume = { ...resume };
    console.log("Starting resume update...");

    const prompt = `Given the following base resume and job description, perform the following tasks:

  Identify Key Requirements & Skills:

  Extract the most important requirements from the job description, such as key objectives, responsibilities, and qualifications. Focus on both hard skills (technical, industry-specific tools, programming languages, methodologies) and soft skills (communication, leadership, adaptability), prioritizing the most critical to the role.
  Identify Buzzwords & Technical Terms:

  Highlight relevant buzzwords, industry-specific terminology, and technical skills from the job description. Ensure emphasis is on tools, languages, or methodologies that align with the base resume.
  Match & Update Resume:

  Review the base resume, identifying sections (experience, skills, accomplishments) where the job description's buzzwords and skills can be seamlessly integrated. Ensure any additions do not change the tone or meaning of the original resume, and preserve its structure and flow. Note: Do not alter dates, job titles, or the core content of the base resume.
  Update Skills Section:

  Add new technical skills to the ‘Technical Skills’ section, only if they are not already listed. Avoid unnecessary duplication and ensure the skills align with the job’s priorities.
  Ensure JSON Format:

  The output must be in JSON format and match the structure of the provided resume.json file. Each section of the resume (e.g., experience, skills) must reflect the changes while maintaining the original JSON structure.
  Guidance:

  Prioritize hard skills and relevant experiences first, followed by soft skills as secondary considerations.
  Integrate keywords naturally, ensuring readability and that the resume's original essence is retained.
  Maintain balance by incorporating skills in a way that reflects the resume’s overall strengths without overloading sections.
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
      max_tokens: 10000,
    });

    console.log("GPT Response received:", gptResponse);

    const updatedText = gptResponse.choices[0]?.message?.content;

    if (!updatedText) {
      throw new Error("No content in GPT response");
    }

    console.log("Updated text from GPT:", updatedText);

    const jsonMatch = updatedText.match(/\{[\s\S]*\}/);
    console.log("JSON match result:", jsonMatch);

    if (jsonMatch) {
      try {
        let afterJsonContent = "";
        const jsonData = JSON.parse(jsonMatch[0]);
        const afterJson = updatedText.split(jsonMatch[0])[1];
        afterJsonContent = afterJson ? afterJson.trim() : "";

        console.log("Content after JSON:", afterJsonContent);
        console.log("Parsed JSON data:", jsonData.basics.summary);

        const doc = new Document({
          sections: [
            {
              children: [
                // Header - Name and Contact Info
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${jsonData.basics.name}`,
                      bold: true,
                      size: 28,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Email: ${jsonData.basics.email} | GitHub: ${jsonData.basics.profiles[0].url} | LinkedIn: ${jsonData.basics.profiles[1].url}`,
                    }),
                  ],
                }),

                // Summary Section
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "\nSummary",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${jsonData.basics.summary}`,
                    }),
                  ],
                }),

                // Work Experience Section
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "\nWork Experience",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),

                ...jsonData.work.flatMap((job) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `\n${job.name} // ${job.position} (${
                          job.startDate
                        } - ${job.endDate || "Present"})`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${job.summary}`,
                      }),
                    ],
                  }),
                  ...job.highlights.map(
                    (highlight) =>
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({
                            text: highlight,
                          }),
                        ],
                      })
                  ),
                ]),

                // Education Section
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "\nEducation",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),

                ...jsonData.education.flatMap((edu) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `\n${edu.institution} (${edu.startDate} - ${
                          edu.endDate || "Present"
                        })`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.studyType} in ${edu.area}`,
                      }),
                    ],
                  }),
                ]),

                // Skills Section
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "\nTechnical Skills",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${jsonData.skills[0].keywords.join(", ")}`,
                    }),
                  ],
                }),
              ],
            },
          ],
        });

        const buffer = await Packer.toBuffer(doc);
        console.log("DOCX file created successfully");
        return { buffer, afterJsonContent };
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
