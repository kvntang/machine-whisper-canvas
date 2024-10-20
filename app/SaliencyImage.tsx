import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SaliencyImageProps {
  canvasDataURL: string;
  setSalImage: (img: string) => void; //emit to front
}

const SaliencyImage: React.FC<SaliencyImageProps> = ({ 
  canvasDataURL, 
  setSalImage,
}) => {
  const [updatedImage, setUpdatedImage] = useState(canvasDataURL);

  const handleGenerate = async () => {
    if (!canvasDataURL) {
      console.error("No image data to process.");
      return;
    }
    try {
      // Convert the canvas data URL to a Blob object
      const response = await fetch(canvasDataURL);
      const blob = await response.blob();
      
      // Create a FormData object to send the image as form-data
      const formData = new FormData();
      formData.append('file', blob, 'image.png'); // Append the blob with the key 'file'
  
      // Make a POST request to the Flask API
      const apiResponse = await fetch('http://127.0.0.1:5000/api/v1/process-image', {
        method: 'POST',
        body: formData, // Send as form-data
      });
  
      if (!apiResponse.ok) {
        console.error('Failed to process the image');
        return;
      }
  
      // Receive the processed image as a Blob
      const processedBlob = await apiResponse.blob();
      
      // Convert the Blob back to a Data URL to update the image
      const processedImageURL = URL.createObjectURL(processedBlob);
      
      // Update the state with the new image
      setUpdatedImage(processedImageURL);
      setSalImage(processedImageURL);
      
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className="w-[400px] h-auto mt-0 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Saliency Map</h2>
        {/* Generate Button that triggers OpenCV processing */}
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      <img
        src={updatedImage}
        alt="Canvas Output"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {/* Hidden canvas used to display OpenCV output */}
      <canvas id="output" style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default SaliencyImage;
