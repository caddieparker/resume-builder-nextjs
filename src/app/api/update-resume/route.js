import { updateResume } from "../../../../lib/controllers/resumeController";

export async function POST(req) {
  try {
    const { jobDescription, companyValues } = await req.json();

    const { buffer } = await updateResume(jobDescription, companyValues);

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=updated_resume.docx",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
