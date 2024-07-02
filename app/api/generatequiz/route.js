import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const POST = async (req) => {
   try {
      const { numberOfQuestions, title } = await req.json();

      const model = genAI.getGenerativeModel({
         model: "gemini-1.5-flash",
         generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
          Generate ${numberOfQuestions} quiz questions with multiple-choice options on ${title}. The questions should follow this JSON schema:
          [
            {
              "question": "String",
              "choices": ["String", "String", "String", "String"],
              "type": "MCQs",
              "correctAnswer": "String"
            }
          ]
          Each "question" field should contain the quiz question as a string. The "choices" field should be an array of four strings, each representing a possible answer. The "type" field should always be "MCQs". The "correctAnswer" field should contain the correct answer as a string.
          `;

      const result = await model.generateContent(prompt);

      return NextResponse.json(
         result.response.candidates[0].content.parts[0].text
      );
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { error: "Failed to generate quiz questions" },
         { status: 500 }
      );
   }
};
