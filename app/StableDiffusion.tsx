// StableDiffusion.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface StableDiffusionProps {
    canvasDataURL: string;
  }

const StableDiffusion: React.FC<StableDiffusionProps> = ({ canvasDataURL }) => {

  return (
    <div className="w-[400px] h-auto mt-0 p-2">
      <div className="flex justify-between items-center mb-2">
        {/* Updated title from Saliency Map to Stable Diffusion */}
        <h2 className="text-lg font-bold">Stable Diffusion</h2>
        {/* Generate Button that triggers Stable Diffusion processing */}
        <Button >Generate</Button>
      </div>

      <img
        src={canvasDataURL}
        alt="Canvas Output"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {/* Hidden canvas used to display Stable Diffusion output */}
      <canvas id="output" style={{ display: 'none' }}></canvas>
    </div>
  );
};

// Updated export to match the new component name
export default StableDiffusion;
