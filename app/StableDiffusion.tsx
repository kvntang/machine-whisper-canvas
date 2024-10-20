// StableDiffusion.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios'; // Ensure axios is imported


interface StableDiffusionProps {
    salImage: string;
    imagePrompt: string;
  }

const StableDiffusion: React.FC<StableDiffusionProps> = ({ salImage, imagePrompt }) => {
  const [diffusionImage, setDiffusionImage] = useState<string>('');

  const toBase64FromBlobURL = (blobUrl: string): Promise<string> => {
    return fetch(blobUrl) // This fetches the blob from the local URL
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string); // Convert blob to base64
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Convert the blob to a base64 string
      }));
  };
  
  

  const handleGenerate = async () => {
    try {
      if (!salImage) {
        console.error('salImage is undefined or invalid.');
        setDiffusionImage('Error: salImage is missing.');
        return;
      }
  
      // Convert the blob URL (salImage) to a base64 string
      const base64Image = await toBase64FromBlobURL(salImage);
      const cleanedBase64Image = base64Image.replace(/^data:image\/(png|jpg);base64,/, "");
  
      const apiRequestBody = {
        prompt: imagePrompt,
        init_images: [cleanedBase64Image], // Base64 string without the data URL prefix
        steps: 50,
        cfg_scale: 7,
        denoising_strength: 0.75,
        width: 512,
        height: 512,
      };
  
      // Call Stable Diffusion API
      const response = await axios.post('/sdapi/v1/img2img', apiRequestBody); //proxy installed in next.config.mjs
  
      if (response.data && response.data.images && response.data.images.length > 0) {
        const generatedImageBase64 = response.data.images[0];
        setDiffusionImage(`data:image/png;base64,${generatedImageBase64}`);
      } else {
        setDiffusionImage('Error generating image');
      }
    } catch (error) {
      console.error('Error fetching image from Stable Diffusion:', error);
      setDiffusionImage('Error generating image');
    }
  };
  

  return (
    <div className="w-full h-auto mt-0 p-2 flex flex-col items-center">
  <img
    src={diffusionImage}
    alt="Diffusion Output"
    style={{ maxWidth: '100%', height: 'auto' }}
  />
  {/* Hidden canvas used to display Stable Diffusion output */}
  <canvas id="output" style={{ display: 'none' }}></canvas>

  <div className="mt-4">
    <Button onClick={handleGenerate}>Generate</Button>
  </div>
</div>


    
  );
};

// Updated export to match the new component name
export default StableDiffusion;
