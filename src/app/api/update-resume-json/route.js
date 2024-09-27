import { resumeToJson } from "../../../../lib/controllers/resumeToJson";

export async function POST(req) {
  console.log("req received: ", req);
  try {
    const formData = await req.formData();
    console.log("formData! received: ", formData);
    const file = formData.get("file");
    console.log("file! received: ", file);
    const arrayBuffer = await file.arrayBuffer();
    console.log("arrayBuffer! received: ", arrayBuffer);
    const buffer = new Uint8Array(arrayBuffer);
    console.log("buffer! received: ", buffer);
    if (!buffer) {
      throw new Error("No file uploaded!!");
    }

    const { json } = await resumeToJson(buffer);

    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
