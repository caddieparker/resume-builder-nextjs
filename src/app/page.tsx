"use client";

import { FormEvent, useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Container,
  Title,
  FileInput,
  Badge,
  Group,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { supabase } from "../../lib/supabaseClient"; // Import Supabase client
import { generateResumeDocx } from "../../lib/services/generateResume";
import { resumeToJson } from "../../lib/controllers/resumeToJson";
import { IconTrash } from "@tabler/icons-react";

// Testing import
import resume from "../../lib/data/resume.json" assert { type: "json" };

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyValues, setCompanyValues] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<null | string>(null);
  const [session, setSession] = useState(null);

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

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/update-resume-json", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json: ", json);
      setJsonFile(json);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
    setUploading(false);
  };

  const removeJsonFile = () => {
    setJsonFile(null);
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
          {loading ? "Processing..." : "Generate Test Doc"}
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

        <FileInput
          placeholder={"Click to add your resume (.docx)"}
          value={file}
          onChange={setFile}
          accept=".docx"
        />
        <Group className={"flex flex-row items-center !justify-between mt-3"}>
          <Button
            onClick={handleUpload}
            className={"items-center"}
            disabled={!file}
            variant="outline"
          >
            {uploading
              ? "Processing..."
              : jsonFile
              ? "Upload New Resume"
              : "Upload Resume"}
          </Button>
          {jsonFile && (
            <Group gap={0}>
              <Badge className={"items-center"} color="green">
                Resume Uploaded
              </Badge>
              <Button
                variant={"transparent"}
                onClick={removeJsonFile}
                className={"items-center"}
              >
                <IconTrash size={20} stroke={1.5} />
              </Button>
            </Group>
          )}
        </Group>

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
            inputSize="xl"
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
