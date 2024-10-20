'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios'; // Ensure axios is imported
import GeneratedPromptWindow from './GeneratedPromptWindow'; // Import the new component
import SidePanel from './SidePanel'; // Import the new SidePanel component
import ImageCanvas from './ImageCanvas'; // Import the ImageCanvas component
import SaliencyImage from './SaliencyImage'; // Import the SaliencyImage component
import StableDiffusion from './StableDiffusion'


interface Image {
  id: number
  file: File
  x: number
  y: number
  scale: number
  zIndex: number
  img: HTMLImageElement
  width: number
  height: number
  caption: string // Added caption field
}

export default function ImageCanvasEditor() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<string>(''); //image prompts
  const [canvasDataURL, setCanvasDataURL] = useState<string>(''); // State to hold the emitted canvas image data URL
  const [salImage, setSalImage] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');



  const handleDeleteImage = (imageId: number) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId))
    if (selectedImage === imageId) {
      setSelectedImage(null)
    }
  }

  // **New Function to Handle Caption Changes**
  const handleCaptionChange = (id: number, newCaption: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, caption: newCaption } : img
      )
    )
  }

  const handleCanvasUpdate = (dataURL: string) => {
    setCanvasDataURL(dataURL); // Update the state with the emitted image data URL
  };

  return (
    <div className="flex h-screen" style={{
      display: 'flex', 
      gap: '2px', // Reduced gap between columns
      padding: '5px' // Optional padding around the layout
    }}>
      
      {/* Column 1 */}      <div className="p-2" style={{ 
        flexBasis: '50%', // Larger column (50% of total width)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div className="canvas-container" style={{
          height: '500px', // Specific size for the canvas div
          marginBottom: '20px',
          padding: '5px',
          backgroundColor: '#000000',
          border: '1px solid #1d1d1d',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ImageCanvas 
            images={images}
            setImages={setImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setCoordinates={setCoordinates}
            setCanvasDataURL={handleCanvasUpdate} // Pass the emit function
          />
        </div>
  
        <div style={{
          height: '600px', // Specific size for the second div
          padding: '10px',
          backgroundColor: '#000000',
          border: '1px solid #1d1d1d',
          borderRadius: '30px'
        }}>
          <StableDiffusion salImage={salImage} imagePrompt={imagePrompt} />   
        </div>
      </div>
  
      {/* Column 2 */}
      <div className="p-2" style={{
        flexBasis: '50%', // Wider column
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          height: '500px',
          backgroundColor: '#e0f7fa',
          overflowY: 'auto',
          padding: '1px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <SidePanel
            images={images}
            selectedImage={selectedImage}
            handleDeleteImage={handleDeleteImage}
            handleCaptionChange={handleCaptionChange}
            setSelectedImage={setSelectedImage}
            setCoordinates={setCoordinates}
          />
        </div>
  
        <div style={{
          height: 'auto', // Auto height
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e0f7fa',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <GeneratedPromptWindow 
            coordinates={coordinates}
            setImagePrompt={setImagePrompt}/>
        </div>
  
        <div style={{
          height: 'auto', // Auto height
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f0f4c3',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <SaliencyImage 
            canvasDataURL={canvasDataURL} 
            setSalImage={setSalImage}/>          
        </div>
      </div>
    </div>
  )
}