import React, { useEffect } from 'react';
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
  setCoordinates: (coordinates: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  images,
  selectedImage,
  handleDeleteImage,
  handleCaptionChange,
  setSelectedImage,
  setCoordinates,
}) => {
  // Automatically call handleGenerate whenever images array changes
  useEffect(() => {
    const handleGenerate = () => {
      let prompt = 'Image Data:\n';

      images.forEach((image) => {
        prompt += `Image ID: ${image.id}, X: ${Math.round(image.x)}, Y: ${Math.round(image.y)}, Caption: "${image.caption}", Z-Index: ${image.zIndex}\n`;
      });

      setCoordinates(prompt);
    };

    // Call the handleGenerate function every time the images array or any relevant data changes
    handleGenerate();
  }, [images, setCoordinates]);

  return (
    <div className="w-[400px] h-[700px] p-4 bg-green-500 overflow-y-auto"> {/* Set fixed height to 600px */}
      <h2 className="text-xl font-bold mb-4">Image List</h2>

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
