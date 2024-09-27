"use client";

import { FormEvent, useState, useEffect } from "react";
import { Textarea, Button, Container, Title, FileInput } from "@mantine/core";
import "@mantine/core/styles.css";
import { supabase } from "../../lib/supabaseClient"; // Import Supabase client
import { generateResumeDocx } from "../../lib/services/generateResume";
import { resumeToJson } from "../../lib/controllers/resumeToJson";

// Testing import
import resume from "../../lib/data/resume.json" assert { type: "json" };

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyValues, setCompanyValues] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<null | string>(null);
  const [session, setSession] = useState(null);

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     console.log("Session data:", data);
  //     setSession((data.session as any) ?? null);
  //   };
  //   fetchSession();
  // }, []);

  const generateDocTEST = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const buffer = await generateResumeDocx(resume);
      const blob = new Blob([buffer]);
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleUpload = async () => {
  //   if (file) {
  //     const response = resumeToJson(file);
  //     setJsonFile(response);
  //     console.log("response", response);
  //   }
  // };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("sending form data", formData);
      console.log(typeof formData);
      const response = await fetch("/api/update-resume-json", {
        method: "POST",
        body: formData,
      });
      const json = await response.formData();
      console.log("jsonnn", json);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/update-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, companyValues }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Button variant={"dark"} onClick={generateDocTEST} className={"my-5"}>
          {loading ? "Updating..." : "Generate Test Doc"}
        </Button>
        <Title order={1} my="md" className={"p-10"}>
          Resume Builder
        </Title>
        <Title order={5}>
          <span>
            {`Upload your resume, paste a job description for the job you're looking
          for.`}
          </span>
        </Title>

        {/* File Input to upload a resume */}
        <FileInput
          placeholder={"Click to add your resume (.docx)"}
          value={file}
          onChange={setFile}
          accept=".docx" // Accept only .docx files
        />

        <Button
          onClick={handleUpload}
          mt="md"
          disabled={!file}
          variant="outline"
        >
          Upload Resume
        </Button>
        {file ? <div>'File Uploaded'</div> : <div>No file selected</div>}
        {jsonFile ? <div>'JSON Uploaded'</div> : <div>No JSON selected</div>}

        <form onSubmit={handleSubmit}>
          <Textarea
            className={"pt-5"}
            placeholder="Add Company Name Here"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            label="Company Name"
            minRows={10}
            mb="md"
          />
          <Textarea
            className={"pt-5"}
            placeholder="AI Instructions"
            value={companyValues}
            onChange={(e) => setCompanyValues(e.target.value)}
            label="Important Instructions"
            minRows={10}
            mb="md"
          />
          <Textarea
            className={"pt-5"}
            placeholder="Paste job description here"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            label="Job Description"
            required
            minRows={10}
            mb="md"
          />
          <Button type="submit" loading={loading} fullWidth variant={"filled"}>
            {loading ? "Updating..." : "Submit Job Description"}
          </Button>
        </form>

        {downloadUrl && (
          <Button
            component="a"
            href={downloadUrl}
            download={`Marshall_Johnston_${companyName}.docx`}
            mt="md"
            fullWidth
          >
            Download Updated Resume
          </Button>
        )}
      </Container>
    </div>
  );
}
