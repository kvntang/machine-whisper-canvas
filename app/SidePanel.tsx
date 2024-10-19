import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import axios from 'axios'; // Ensure axios is imported

interface Image {
  id: number;
  x: number;
  y: number;
  zIndex: number;
  caption: string;
}

interface SidePanelProps {
  images: Image[];
  selectedImage: number | null;
  handleDeleteImage: (imageId: number) => void;
  handleCaptionChange: (id: number, newCaption: string) => void;
  setSelectedImage: (id: number) => void;
  setGeneratedPrompt: (prompt: string) => void; // Add this line to set the generated prompt
}

const SidePanel: React.FC<SidePanelProps> = ({
  images,
  selectedImage,
  handleDeleteImage,
  handleCaptionChange,
  setSelectedImage,
  setGeneratedPrompt, // Add this line
}) => {
  const handleGenerate = async () => {
    let prompt = 'Image Data:\n';

    images.forEach((image) => {
      prompt += `Image ID: ${image.id}, X: ${Math.round(image.x)}, Y: ${Math.round(image.y)}, Caption: "${image.caption}", Z-Index: ${image.zIndex}\n`;
    });

    // **New Code to Call OpenAI API using Axios**
    try {
      const apiRequestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are receiving coordinates of objects as well as a caption describing the object. Reply in natural language describing the positional relationship for example a big round apple, is left of, above, behind, across, underneath, etc. Also it can be in relation to the canvas itself. The canvas is 600 wide, 400 height." },
          { role: 'user', content: prompt }
        ]
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', apiRequestBody, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      // Return the AI's response to the frontend
      setGeneratedPrompt(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching reply from OpenAI:', error);
      setGeneratedPrompt('Error generating prompt');
    }
  };

  return (
    <div className="w-[400px] h-[700px] p-4 bg-green-500 overflow-y-auto"> {/* Set fixed height to 600px */}
      <h2 className="text-xl font-bold mb-4">Image List</h2>

      {/* New Generate Button */}
      <Button onClick={handleGenerate} variant="primary" className="mb-4">
        Generate
      </Button>

      {/* Image Meta Data Div */}
      {images.map((image) => (
        <div
          key={image.id}
          className={`mb-4 p-2 border ${
            selectedImage === image.id ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          {/* Texts */}
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => setSelectedImage(image.id)}>
              <p className="font-semibold">Image {image.id}</p>
              <p>
                Center: ({Math.round(image.x)}, {Math.round(image.y)}) | Z-Index: {image.zIndex}
              </p>
            </div>

            {/* Delete Button */}
            {selectedImage === image.id && (
              <Button
                variant="destructive"
                size="icon"
                className="ml-2"
                onClick={() => handleDeleteImage(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Caption Text Box */}
          <div className="mt-2">
            <label htmlFor={`caption-${image.id}`} className="text-sm font-medium">
              Caption:
            </label>
            <input
              id={`caption-${image.id}`}
              type="text"
              value={image.caption}
              onChange={(e) => handleCaptionChange(image.id, e.target.value)}
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="Enter caption..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidePanel;
