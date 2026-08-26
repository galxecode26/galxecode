export interface Faq {
  label: string;
  question: string;
  answer: string;
  chips?: string[];
}

export const FAQS: Faq[] = [
  {
    label: "What is it?",
    question: "What is GalxeCode'26?",
    answer:
      "GalxeCode'26 is an AI-focused Vibe Coding Hackathon designed to introduce students, developers, designers, and aspiring founders to modern AI-powered development and rapid product building.",
  },
  {
    label: "Objective",
    question: "What is the main objective of the hackathon?",
    answer:
      "The event aims to promote AI innovation, foster startup culture, build industry-ready skills, encourage product thinking, and connect students with industry professionals.",
  },
  {
    label: "Who can join?",
    question: "Who can participate?",
    answer:
      "The event is aimed at students, developers, designers, founders, and other technology enthusiasts interested in building innovative products with AI.",
  },
  {
    label: "Vibe Coding?",
    question: "What is Vibe Coding?",
    answer:
      "Vibe Coding is an AI-assisted approach to software development where participants use modern AI tools to rapidly prototype, develop, iterate, and build functional products.",
  },
  {
    label: "What you gain",
    question: "What do participants gain?",
    answer:
      "Participants get hands-on experience with AI development tools, opportunities to work with mentors and industry experts, and exposure to real-world product development.",
  },
  {
    label: "For companies",
    question: "Why should companies partner with GalxeCode'26?",
    answer:
      "Partners can engage directly with emerging developers and AI builders, showcase their products, identify potential talent, and build meaningful relationships with the next generation of innovators.",
  },
  {
    label: "Sponsorship",
    question: "What sponsorship options are available?",
    answer:
      "GalxeCode offers multiple sponsorship categories, including customized partnerships:",
    chips: ["Title", "Gold", "Silver", "Community", "Custom"],
  },
  {
    label: "Support types",
    question: "What kind of partnership support is accepted?",
    answer:
      "We welcome financial sponsorships, technology and cloud credits, developer tools, mentorship, speakers, prizes, media support, merchandise, food & beverage, and other relevant in-kind partnerships.",
  },
  {
    label: "Visibility",
    question: "How will sponsors receive visibility?",
    answer:
      "Sponsors receive visibility across digital, physical, and media touchpoints, including Instagram, LinkedIn, WhatsApp, email campaigns, website promotions, campus channels, and community networks.",
  },
  {
    label: "Get in touch",
    question: "How can a company become a partner?",
    answer:
      "Companies can contact the GalxeCode team to discuss the available sponsorship tiers or create a customized partnership aligned with their objectives.",
  },
];
