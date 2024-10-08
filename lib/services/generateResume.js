import {
  Packer,
  Document,
  Paragraph,
  TextRun,
  Header,
  HeadingLevel,
  AlignmentType,
  TabStopType,
  Tab,
  ExternalHyperlink,
} from "docx";

const githubIcon = Buffer.from(
  "../../public/icons/brand-github.png"
).toString();

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Present";
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function generateResume(jsonData) {
  const { name, email, profiles, summary } = jsonData.basics;
  const doc = new Document({
    background: {
      color: "38383B",
    },
    styles: {
      numbering: {
        config: [
          {
            reference: "color-bullets",
          },
        ],
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: "FFFFFF",

            font: "Microsoft Sans Serif",
            size: 48,
          },
          paragraph: {
            spacing: {
              line: 0,
            },
            indent: {
              left: 0,
            },
          },
        },
        {
          id: "Heading2",
          name: "Section Headers",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: "1C7ED6",
            bold: true,
            font: "Arial",
            size: 24,
          },
          paragraph: {
            border: {
              bottom: {
                color: "FFFFFF",
                space: 1,
                style: "single",
                size: 6,
              },
            },
            alignment: AlignmentType.START,
            spacing: {
              line: 0,
              before: 120,
              after: 120,
            },
            indent: {
              left: 0,
            },
          },
        },
        {
          id: "Heading3",
          name: "Job Titles",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: "FFFFFF",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              line: 0,
              before: 120,
            },
            indent: {
              left: 0,
            },
          },
        },
        {
          id: "Heading4",
          name: "Style for Experience",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: "d9d9d9",
            font: "Arial",
            size: 18,
          },
          paragraph: {
            spacing: {
              line: 0,
            },
            indent: {
              left: 100,
              hanging: 300,
              start: 0,
            },
          },
        },
        {
          id: "Heading5",
          name: "Style for Freeform Text",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: "d9d9d9",
            font: "Arial",
            size: 18,
          },
          paragraph: {
            spacing: {
              line: 0,
              before: 0,
              after: 120,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              left: "15mm",
              right: "15mm",
              bottom: "15mm",
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [new TextRun({ text: name, bold: true, size: 24 })],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                font: "Arial",
                color: "FFFFFF",
                children: [
                  new TextRun(" "),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: "LinkedIn",

                        underline: true,
                        bold: true,
                      }),
                    ],
                    link: profiles[1].url,
                  }),

                  new TextRun(" | "),
                  new TextRun(" "),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: "GitHub",
                        // font: "Arial",
                        color: "FFFFFF",
                        underline: true,
                        bold: true,
                      }),
                    ],
                    link: profiles[0].url,
                  }),

                  new TextRun(" | "),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: "marshalljohnston77@gmail.com",
                        underline: true,
                        bold: true,
                      }),
                    ],
                    link: `mailto:${email}`,
                  }),
                  new TextRun(" | "),
                  new TextRun({
                    text: 416 - 436 - 8583,
                    font: "Arial",
                    color: "FFFFFF",
                    underline: false,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_4,
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "Summary",
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_5,
            children: [
              new TextRun({
                text: summary,
              }),
            ],
          }),
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
          }),

          ...jsonData.skills.map((skill) => {
            return new Paragraph({
              heading: HeadingLevel.HEADING_5,
              children: [
                new TextRun({
                  text: `${skill.keywords.join(" | ")}`,
                }),
              ],
            });
          }),
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
          }),

          ...jsonData.work
            .map((job) => {
              return [
                new Paragraph({
                  heading: HeadingLevel.HEADING_3,
                  children: [
                    new TextRun({ text: job.position, bold: true }),
                    new TextRun({ text: ` | ${job.name}`, italics: true }),
                    job.location
                      ? new TextRun({ text: ` | ${job.location}` })
                      : null,
                    new TextRun({
                      children: [
                        new Tab(),
                        `${formatDate(job.startDate)} - ${
                          formatDate(job.endDate) || "Present"
                        }`,
                      ],
                    }),
                  ].filter(Boolean),
                  tabStops: [{ type: TabStopType.END, position: 11000 }],
                }),
                new Paragraph({
                  heading: HeadingLevel.HEADING_5,

                  children: [
                    new TextRun({
                      text: job.summary,
                    }),
                  ],
                }),
                ...job.highlights.map(
                  (highlight) =>
                    new Paragraph({
                      heading: HeadingLevel.HEADING_4,
                      alignment: AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          color: "1C7ED6",
                          text: `• `,
                        }),
                        new TextRun({
                          text: `${highlight}`,
                        }),
                      ],
                    })
                ),
              ];
            })
            .flat(),

          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
          }),
          ...jsonData.education
            .map((edu) => {
              return [
                new Paragraph({
                  heading: HeadingLevel.HEADING_4,
                  children: [
                    new TextRun({ text: `${edu.institution}`, bold: true }),
                    new TextRun({ text: ` | ${edu.area}`, italics: true }),
                    edu.studyType
                      ? new TextRun({ text: ` | ${edu.studyType}` })
                      : null,
                    new TextRun({
                      children: [
                        new Tab(),
                        `${formatDate(edu.startDate)} - ${
                          formatDate(edu.endDate) || "Present"
                        }`,
                      ],
                    }),
                  ].filter(Boolean),
                  tabStops: [{ type: TabStopType.END, position: 11000 }],
                }),
              ];
            })
            .flat(),
        ],
      },
    ],
  });
  return doc;
}

export const generateResumeDocx = async (jsonData) => {
  try {
    const doc = generateResume(jsonData);
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
};
