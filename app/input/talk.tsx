import { OPENAI_API_KEY } from "@env";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function talk(
  setMsgs: React.Dispatch<React.SetStateAction<any[]>>,
  msgs: any[],
): Promise<void> {
  setMsgs([...msgs, { type: "ai", text: "..." }]);
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Nice to Meet you" }],
      model: "gpt-3.5-turbo",
    });

    const response = {
      type: "ai",
      text: chatCompletion.choices[0].message.content || "",
    };

    setMsgs([...msgs, response]);
  } catch (err) {
    console.error(err);
  }
}
