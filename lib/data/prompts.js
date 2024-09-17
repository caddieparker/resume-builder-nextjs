export const outputPrompt = () => {
  return (exaggeratePrompt = `Given the following base resume and job description, enhance the resume to maximize its relevance to the role and increase its appeal to recruiters. Perform the following tasks:

1. Identify Key Requirements & Skills:
Extract the most critical requirements from the job description, including key objectives, responsibilities, and qualifications.
Focus on both hard skills (technical expertise, industry-specific tools, programming languages, methodologies) and soft skills (communication, leadership, adaptability).
Prioritize skills that are explicitly mentioned or strongly implied in the job description.
2. Identify Buzzwords & Industry Terminology:
Highlight relevant buzzwords, technical terms, and industry-specific language from the job description.
Emphasize specific tools, technologies, methodologies, or frameworks mentioned, ensuring alignment with the candidate’s base resume.
3. Exaggerate Without Lying:
Review the candidate’s listed accomplishments and responsibilities. Where appropriate, exaggerate the impact, scope, or scale of these achievements without fabricating facts.
Example: If the resume lists leading a team responsible for $260k MRR, enhance the description (e.g., "Led a team responsible for scaling revenue operations to support $3.1M MRR").
Ensure the tone remains authentic, but present the candidate as more impactful, strategic, and aligned with the job description.
4. Match & Update Resume:
Identify areas in the resume (e.g., experience, skills, accomplishments) where the job description's key skills and buzzwords can be seamlessly integrated.
Ensure that the updates preserve the original meaning and intent of the resume while improving its impact and flow.
Do not alter dates, job titles, or any core factual details from the base resume.
5. Update Specific Sections:
Update Summary Section: Rewrite the summary to highlight relevant skills and accomplishments that align directly with the job’s top priorities, and reflect the candidate’s overall growth and expertise.
Update Job Summary Section: Adjust the job summary for each role but make sure the summary doesn't match the words of any of the job highlights. 
Update Experience Section: Adjust responsibilities and achievements to incorporate buzzwords and show leadership, innovation, or measurable success in line with the job description.
Update Skills Section: Add new technical skills only if they are critical to the role and not already listed. Avoid unnecessary duplication or overloading, focusing on aligning with the job’s priorities.
6. Ensure JSON Format:
The output must be returned in JSON format and maintain the original structure of the provided resume.json file.
Ensure each updated section of the resume (e.g., experience, skills) reflects the changes while maintaining the original structure.
7. Guidance:
Prioritize hard skills and measurable experiences first, followed by soft skills.
Integrate keywords naturally to ensure readability while preserving the resume’s core tone and narrative.
Maintain balance across sections to reflect the candidate’s overall strengths without overloading any single area.`);
};

const initialPrompt = `Given the following base resume and job description, perform the following tasks:

  Identify Key Requirements & Skills:

  Extract the most important requirements from the job description, such as key objectives, responsibilities, and qualifications. Focus on both hard skills (technical, industry-specific tools, programming languages, methodologies) and soft skills (communication, leadership, adaptability), prioritizing the most critical to the role.
  Identify Buzzwords & Technical Terms:

  Highlight relevant buzzwords, industry-specific terminology, and technical skills from the job description. Ensure emphasis is on tools, languages, or methodologies that align with the base resume.
  Match & Update Resume:

  Review the base resume, identifying sections (experience, skills, accomplishments) where the job description's buzzwords and skills can be seamlessly integrated. Ensure any additions do not change the tone or meaning of the original resume, and preserve its structure and flow. Note: Do not alter dates, job titles, or the core content of the base resume.
  
  Update Summary Section: 
  
  Update Experience Section: 
  
  Update Skills Section:

  Add new technical skills to the ‘Technical Skills’ section, only if they are not already listed. Avoid unnecessary duplication and ensure the skills align with the job’s priorities.
  Ensure JSON Format:

  The output must be in JSON format and match the structure of the provided resume.json file. Each section of the resume (e.g., experience, skills) must reflect the changes while maintaining the original JSON structure.
  Guidance:

  Prioritize hard skills and relevant experiences first, followed by soft skills as secondary considerations.
  Integrate keywords naturally, ensuring readability and that the resume's original essence is retained.
  Maintain balance by incorporating skills in a way that reflects the resume’s overall strengths without overloading sections.`;
