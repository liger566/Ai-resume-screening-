/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ATSBreakdown {
  formatting: number;
  keywords: number;
  readability: number;
  impact: number;
}

export interface SkillStrength {
  name: string;
  score: number;
}

export interface AnalysisResult {
  score: number;
  skillsFound: string[];
  missingSkills: string[];
  suggestions: string;
  recommendedRoles: string[];
  summary: string;
  atsBreakdown: ATSBreakdown;
  skillStrengths: SkillStrength[];
  careerRoadmap: string[];
  improvedSummary?: string;
  improvedBullets?: string[];
  keywords: {
    good: string[];
    missing: string[];
  };
}

export type JobRole = "Data Scientist" | "Web Developer" | "UI/UX Designer" | "Software Engineer" | "Product Manager";

export interface HistoryItem extends AnalysisResult {
  id: string;
  userId: string;
  fileName: string;
  role: JobRole;
  createdAt: any;
}

export const JOB_ROLES_JD: Record<JobRole, string> = {
  "Data Scientist": "Python, Machine Learning, Pandas, NumPy, SQL, Statistics, Data Visualization, Scikit-learn, TensorFlow/PyTorch",
  "Web Developer": "HTML, CSS, JavaScript, React, Node.js, TypeScript, Tailwind CSS, REST APIs, Database Management",
  "UI/UX Designer": "Figma, User Research, Wireframing, Prototyping, Visual Design, Interaction Design, Adobe Creative Suite",
  "Software Engineer": "Java, C++, Python, Data Structures, Algorithms, System Design, Git, Agile Methodologies, Testing",
  "Product Manager": "Product Strategy, Roadmap, User Stories, Agile, Market Research, Stakeholder Management, Data Analysis"
};
