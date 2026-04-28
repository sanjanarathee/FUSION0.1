import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ================================================================
   ✅ KEYWORD EVALUATION
================================================================ */
export const evaluateWithKeywords = (answer, keywords, maxMarks) => {
  let score = 0;

  if (!answer || answer.trim().length < 20) {
    return { marks: 0, feedback: "Answer too short" };
  }

  // 🔥 FIX 1: avoid crash
  if (!keywords || keywords.length === 0) {
    return { marks: 0 };
  }

  const lowerAnswer = answer.toLowerCase();

  keywords.forEach((keyword) => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      score++;
    }
  });

  let marks = Math.round((score / keywords.length) * maxMarks);

  // 🔥 FIX 2: clamp marks
  marks = Math.max(0, Math.min(marks, maxMarks));

  return { marks };
};


/* ================================================================
   🤖 GROQ AI (POINT FORMAT + SAFE)
================================================================ */
export const evaluateWithAI = async (question, studentAnswer, maxMarks) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
You are a strict teacher.

Evaluate the student's answer based on the question.

Question: ${question}
Student Answer: ${studentAnswer}

STRICT RULES:
- Maximum marks: ${maxMarks}
- Give marks strictly out of ${maxMarks}
- DO NOT give full marks unless answer is perfect
- If answer is weak → low marks
- If average → medium marks
- If good → high marks

Feedback Rules:
- Only 3 to 4 bullet points
- Each line starts with "-"
- Each point max 10 words
- No paragraph

Return EXACT format:

Marks: X

Feedback:
- point 1
- point 2
- point 3
`,
        },
      ],
    });

    const text =
      response?.choices?.[0]?.message?.content ||
      "Marks: 0\nFeedback:\n- Could not evaluate";

    console.log("🧠 AI RAW:", text);

    // ✅ MARKS
    const marksMatch = text.match(/Marks:\s*(\d+)(?:\s*\/\s*\d+)?/i);

let marks = marksMatch ? parseInt(marksMatch[1]) : 0;

// 🔥 HARD LIMIT
marks = Math.max(0, Math.min(marks, maxMarks));
    // ✅ FEEDBACK
let feedbackMatch = text.match(/Feedback:\s*([\s\S]*)/i);

    let feedback = feedbackMatch
  ? feedbackMatch[1].trim()
  : "";

  // 🔥 fallback if empty
if (!feedback || feedback.length < 5) {
  feedback = `
- Answer needs improvement
- Add key concepts
- Use bullet points
  `.trim();
}

    // 🔥 CLEAN BULLET POINTS
    const lines = feedback.split("\n");

    const clean = lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => (l.startsWith("-") ? l : "- " + l));

    feedback = clean.join("\n");

    return { marks, feedback };

  } catch (err) {
    console.error("AI ERROR:", err);

    return {
      marks: 0,
      feedback: "- AI failed\n- Try again\n- Write clearer answer",
    };
  }
};