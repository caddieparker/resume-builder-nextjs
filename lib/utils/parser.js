import nlp from "compromise";

export const extractKeywords = (jobDescription) => {
  const doc = nlp(jobDescription);

  const nouns = doc.nouns().out("array");

  const verbs = doc.verbs().out("array");

  const uniqueKeywords = [...new Set([...nouns, ...verbs])];
  console.log(uniqueKeywords);

  return uniqueKeywords;
};

export const extractKeywordsViaOpenAI = (description) => {
  const jobDescription = description;

  const gptResponse = openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: jobDescription }],
    max_tokens: 10000,
  });

  return (uniqueKeywords = gptResponse.choices[0].message.content);
};
