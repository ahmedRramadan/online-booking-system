// pages/api/chat.js

import axios from 'axios';

export default async function handler(req, res) {
  const { message, context } = req.body;
  try {
    // هنا، يمكن استخدام API الخاص بـ OpenAI لإرسال السؤال والحصول على الرد
    const response = await axios.post('https://api.openai.com/v4/completions', {
      model: "text-davinci-003",
      prompt: `The event details are: ${JSON.stringify(context)}. The user asked: ${message}`,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer sk-proj-FSx8s8PdyMn1IJJeUZBqT3BlbkFJINnNP4lSFZ4PziY4Oidk`
      }
    });
    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}