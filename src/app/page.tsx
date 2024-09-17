"use client";

import { FormEvent, useState } from "react";
import { Textarea, Button, Container, Title, FileInput } from "@mantine/core";
import "@mantine/core/styles.css";
import { generateResumeDocx } from "../../lib/services/generateResume";
//testing import
import resume from "../../lib/data/resume.json" assert { type: "json" };

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyValues, setCompanyValues] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<null | string>(null);

  const generateDocTEST = async (e: FormEvent) => {
    e.preventDefault;
    try {
      const buffer = await generateResumeDocx(resume);
      console.log("buffer created", buffer);
      const blob = new Blob([buffer]);
      const url = window.URL.createObjectURL(blob);
      console.log("new url created");
      setDownloadUrl(url);
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
      console.log("blob", blob);
      const url = window.URL.createObjectURL(blob);
      console.log("url", url);
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
        <FileInput placeholder={"Click to add your resume"} />

        <form onSubmit={generateDocTEST}>
          <Textarea
            className={"pt-5"}
            placeholder="add the company values here"
            value={companyValues}
            onChange={(e) => setCompanyValues(e.target.value)}
            label="Company Values"
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
            download="updated_resume.docx"
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
