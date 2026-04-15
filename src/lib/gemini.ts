import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, JobRole, JOB_ROLES_JD } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string, targetRole: JobRole): Promise<AnalysisResult> {
  const jd = JOB_ROLES_JD[targetRole];
  
  const prompt = `
    You are an expert AI Resume Analyzer and Career Coach. Analyze the following resume text against the job description for the role of ${targetRole}.
    
    Job Description Keywords/Skills: ${jd}
    
    Resume Text:
    ${resumeText}
    
    Provide a detailed analysis in JSON format with the following structure:
    {
      "score": number (0-100),
      "skillsFound": string[],
      "missingSkills": string[],
      "suggestions": string,
      "recommendedRoles": string[],
      "summary": string,
      "atsBreakdown": {
        "formatting": number (0-100),
        "keywords": number (0-100),
        "readability": number (0-100),
        "impact": number (0-100)
      },
      "skillStrengths": [
        { "name": string, "score": number (0-100) }
      ],
      "careerRoadmap": string[] (3-5 steps to reach the target role),
      "improvedSummary": string (a professional summary rewritten for impact),
      "improvedBullets": string[] (3-5 improved bullet points for work experience),
      "keywords": {
        "good": string[] (skills to highlight in green),
        "missing": string[] (skills to highlight in red)
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          skillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.STRING },
          recommendedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          atsBreakdown: {
            type: Type.OBJECT,
            properties: {
              formatting: { type: Type.NUMBER },
              keywords: { type: Type.NUMBER },
              readability: { type: Type.NUMBER },
              impact: { type: Type.NUMBER }
            },
            required: ["formatting", "keywords", "readability", "impact"]
          },
          skillStrengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["name", "score"]
            }
          },
          careerRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvedSummary: { type: Type.STRING },
          improvedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: {
            type: Type.OBJECT,
            properties: {
              good: { type: Type.ARRAY, items: { type: Type.STRING } },
              missing: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["good", "missing"]
          }
        },
        required: ["score", "skillsFound", "missingSkills", "suggestions", "recommendedRoles", "summary", "atsBreakdown", "skillStrengths", "careerRoadmap", "keywords"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  const prompt = `
    You are HireSense AI, a professional career chatbot. 
    Context about the user's resume/analysis: ${context || "No context provided yet."}
    
    User message: ${message}
    
    Provide helpful, professional, and encouraging career advice. Keep it concise and actionable.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt
  });

  return response.text;
}
