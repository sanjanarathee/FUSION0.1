import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ✅ 1. KEYWORD-BASED EVALUATION
export const evaluateWithKeywords = (answer, keywords, maxMarks) => {
  let score = 0;

  if (!answer || answer.trim().length < 20) {
    return {
      marks: 0,
      feedback: "Answer too short",
    };
  }

  const lowerAnswer = answer.toLowerCase();

  if (!keywords || keywords.length === 0) {
    return {
      marks: 0,
      feedback: "No keywords provided",
    };
  }

  keywords.forEach((keyword) => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      score++;
    }
  });

  const marks = Math.round((score / keywords.length) * maxMarks);

  let feedback = "";
  if (marks > maxMarks * 0.7) {
    feedback = "Good answer, most keywords covered";
  } else if (marks > maxMarks * 0.4) {
    feedback = "Average answer, some concepts missing";
  } else {
    feedback = "Poor answer, important keywords missing";
  }

  return { marks, feedback };
};



// ✅ 2. GROQ AI EVALUATION (FINAL SAFE VERSION 🔥)
export const evaluateWithAI = async (
  question,
  correctAnswer,
  studentAnswer,
  maxMarks
) => {
  try {
    const response = await groq.chat.completions.create({
      // ✅ LATEST WORKING MODEL
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "You are a strict teacher. Do not give full marks easily. Be fair and critical.",
        },
        {
          role: "user",
          content: `
Question: ${question}

Student Answer: ${studentAnswer}

Instructions:
- Evaluate based on correctness and understanding
- Check if concepts match the question
- Penalize vague or irrelevant answers
- Give marks out of ${maxMarks}
- Keep feedback short (1-2 lines)

Format strictly:
Marks: X/${maxMarks}
Feedback: ...
`,
        },
      ],
    });

    // ✅ SAFE RESPONSE ACCESS
    const output =
      response?.choices?.[0]?.message?.content ||
      `Marks: 0/${maxMarks}\nFeedback: Could not evaluate`;

    return output;

  } catch (err) {
    console.error("🔥 Groq FULL ERROR:", err);

    return `Marks: 0/${maxMarks}\nFeedback: Error evaluating answer`;
  }
};