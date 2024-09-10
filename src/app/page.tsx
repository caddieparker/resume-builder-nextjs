"use client";

import { FormEvent, useState } from "react";
import { Textarea, Button, Container, Title, FileInput } from "@mantine/core";
import "@mantine/core/styles.css";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyValues, setCompanyValues] = useState("");
  const [afterJsonContent, setAfterJsonContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<null | string>(null);

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
      const data = await response.json();
      setAfterJsonContent(data.afterJsonContent);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Container>
      <Title order={1} my="md" className={"p-10"}>
        Resume Builder
      </Title>
      <Title order={5}>
        <span>
          {`Upload your resume, paste a job description for the job you're looking
          for.`}
        </span>
      </Title>
      <FileInput disabled placeholder={"Click to add your resume"} />

      <form onSubmit={handleSubmit}>
        <Textarea
          className={"pt-5"}
          placeholder="add the company values here"
          value={companyValues}
          onChange={(e) => setCompanyValues(e.target.value)}
          label="Company Values"
          required
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
      {afterJsonContent && (
        <Textarea value={afterJsonContent} readOnly rows={10} />
      )}
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
  );
}
