// SaliencyImage.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useOpenCV from './OpenCV';

interface SaliencyImageProps {
  canvasDataURL: string;
}

const SaliencyImage: React.FC<SaliencyImageProps> = ({ canvasDataURL }) => {
  const [updatedImage, setUpdatedImage] = useState(canvasDataURL);
  const isOpenCVReady = useOpenCV(); // Load OpenCV globally

  const handleGenerate = () => {
    if (!isOpenCVReady) {
      console.error('OpenCV is not ready yet.');
      return;
    }

    const imageInput = new Image();
    imageInput.src = canvasDataURL;

    imageInput.onload = function () {
      let mat = window.cv.imread(imageInput); // Read image data into OpenCV matrix
      window.cv.cvtColor(mat, mat, window.cv.COLOR_RGBA2GRAY); // Convert to greyscale

      // Display processed image in an output canvas element
      window.cv.imshow('output', mat);
      const outputCanvas = document.getElementById('output') as HTMLCanvasElement;
      const imageOutput = outputCanvas.toDataURL(); // Save processed image as a data URL

      setUpdatedImage(imageOutput); // Update state with new image

      mat.delete(); // Clean up the matrix
    };
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
