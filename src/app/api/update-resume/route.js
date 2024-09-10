import { updateResume } from "../../../../lib/controllers/resumeController";

export async function POST(req) {
  try {
    const { jobDescription, companyValues } = await req.json();

    console.log("Job description and company values received:", {
      jobDescription,
      companyValues,
    });

    const { docBuffer, afterJsonContent } = await updateResume(
      jobDescription,
      companyValues
    );

    console.log("DOCX buffer generated successfully");

    // Return both the DOCX file buffer and the afterJsonContent
    return new Response(JSON.stringify({ docBuffer, afterJsonContent }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
