import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    // Get the session from Supabase
    const { data, error } = await supabase.auth.getSession();

    console.log("Session data @ upload-resume:", data);

    if (!data || !data.session) {
      console.log("No session data", error);
      return new Response(JSON.stringify({ error: "User not logged in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the uploaded file from the request
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upload the file to Supabase Storage
    const fileName = file instanceof File ? file.name : "unknown";

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(`${data.session.user.id}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false, // Change to true if you want to overwrite existing files
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({
          error: "Failed to upload resume",
          details: uploadError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Resume uploaded successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error uploading resume:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
