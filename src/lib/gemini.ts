import Groq from 'groq-sdk';

// Groq AI integration for styling advice
const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

interface StylingRequest {
  message: string;
  selectedItems?: Array<{
    name: string;
    category: string;
  }>;
}

export const getStylingAdvice = async ({ message, selectedItems = [] }: StylingRequest): Promise<string> => {
  const systemPrompt = `You are a Professional Wardrobe Stylist. You ONLY provide advice on:
1. Pairing advice for selected items
2. Outfit suggestions for specific weather or events (formal, college, etc.)

If asked about your model identity or anything outside of fashion/styling, respond ONLY: "Sorry! I don't know that."

Responses must be concise (2-3 lines maximum).`;

  let contextMessage = message;
  if (selectedItems.length > 0) {
    const itemsList = selectedItems.map(item => `${item.name} (${item.category})`).join(', ');
    contextMessage = `Selected items: ${itemsList}\n\nUser question: ${message}`;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    
    return completion.choices[0]?.message?.content || 'Sorry, I could not generate styling advice.';
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to get styling advice');
  }
};
