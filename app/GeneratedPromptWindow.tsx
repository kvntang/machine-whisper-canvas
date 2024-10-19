import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Ensure the Button component is imported
import axios from 'axios'; // Ensure axios is imported

interface GeneratedPromptProps {
  coordinates: string;
}

const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ coordinates }) => {
  // State to hold the generated prompt from the API
  const [chatgptResponse, setChatgptResponse] = useState<string>('');

  const handleGenerate = async () => {
    try {
      const apiRequestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are receiving coordinates of objects as well as a caption describing the object. Reply in natural language describing the positional relationship for example a big round apple, is left of, above, behind, across, underneath, etc. Also it can be in relation to the canvas itself. The canvas is 600 wide, 400 height.',
          },
          { role: 'user', content: coordinates },
        ],
      };

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        apiRequestBody,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Set the response data to the state
      setChatgptResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching reply from OpenAI:', error);
      setChatgptResponse('Error generating prompt');
    }
  };

  return (
    <div className="w-full h-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Positional Prompt</h2>
        {/* Generate Button using the Button UI component */}
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      {/* Separate div for the generated response */}
      <div>
        <pre className="whitespace-pre-wrap">{chatgptResponse}</pre>
      </div>
    </div>
  );
};

export default GeneratedPrompt;
