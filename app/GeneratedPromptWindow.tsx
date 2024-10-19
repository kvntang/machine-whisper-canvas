import React from 'react';
import { Button } from '@/components/ui/button'; // Ensure the Button component is imported
import axios from 'axios'; // Ensure axios is imported

interface Image {
    id: number;
    x: number;
    y: number;
    zIndex: number;
    caption: string;
  }
interface GeneratedPromptProps {
  generatedPrompt: string;
  images: Image[];
  selectedImage: number | null;
}

const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ generatedPrompt }) => {
  return (
    <div className="w-[600px] h-[200px] mt-4 p-4 border border-gray-300 bg-green-500">
      <h2 className="text-lg font-bold mb-2">Generated Prompt</h2>
      <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>

      {/* Generate Button using the Button UI component */}
      <Button >
        Generate
      </Button>

    </div>
  );
};

export default GeneratedPrompt;
