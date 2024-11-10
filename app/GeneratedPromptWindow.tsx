import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Ensure the Button component is imported
import axios from 'axios'; // Ensure axios is imported

interface GeneratedPromptProps {
  coordinates: string;
  setImagePrompt: (prompt: string) => void; //emit to front
}

const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ 
  coordinates,
  setImagePrompt,
}) => {
  // State to hold the generated prompt from the API
  const [chatgptResponse, setChatgptResponse] = useState<string>('');

  const handleGenerate = async () => {
    try {
      const apiRequestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: "You will receive a list of objects, each with a description and coordinates. Your task is to generate a descriptive prompt for Stable Diffusion, inferring the spatial relationships between objects based on their coordinates. Use terms like 'to the left of,' 'above,' 'behind,' 'across from,' and 'underneath' to describe their positions relative to one another. Ensure the prompt is vivid, capturing not just the positions, but also textures, lighting, and the overall atmosphere, creating a cohesive and detailed visual scene."
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
      setImagePrompt(response.data.choices[0].message.content);

    } catch (error) {
      console.error('Error fetching reply from OpenAI:', error);
      setChatgptResponse('Error generating prompt');
    }
  };

  return (
    <div className="w-[400px] h-auto mt-0 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">Positional Prompt</h2>
        {/* Generate Button using the Button UI component */}
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
  
      {/* Directly render the generated response without an extra div */}
      <pre className="whitespace-pre-wrap text-white">{chatgptResponse}</pre>
    </div>
  );
};

export default GeneratedPrompt;
