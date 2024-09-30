import { supabase } from "../../../lib/supabaseClient";

export const fetchResume = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("json_resume, uploaded_at")
      .eq("id", userId)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching resume:", error.message);
    return null;
  }
};

export const upsertResume = async (userId, resumeData) => {
  try {
    const { error } = await supabase.from("resumes").upsert(
      {
        uuid: userId,
        resume_data: resumeData,
      },
      { onConflict: ["id"] }
    );

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error inserting/updating resume:", error.message);
    return false;
  }
};
