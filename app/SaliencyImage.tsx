import React from 'react';
import { Button } from '@/components/ui/button';


interface SaliencyImageProps {
  canvasDataURL: string;
}

const SaliencyImage: React.FC<SaliencyImageProps> = ({ canvasDataURL }) => {
  return (
    <div className="w-[400px] h-auto mt-0 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Saliency Map</h2>
        {/* Generate Button using the Button UI component */}
        <Button>Generate</Button>
      </div>

      
      <img 
      src={canvasDataURL} 
      alt="Canvas Output" 
      style={{ maxWidth: '100%', height: 'auto' }} 
    />
    </div>

  );
};

export default SaliencyImage;
