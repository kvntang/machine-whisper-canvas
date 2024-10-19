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
import ImageCanvas from './ImageCanvas'; // Import the new ImageCanvas component


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
  // const [images, setImages] = useState<Image[]>([])
  // const [selectedImage, setSelectedImage] = useState<number | null>(null)
  // const [isDragging, setIsDragging] = useState(false)
  // const [isScaling, setIsScaling] = useState(false)
  // const [initialScale, setInitialScale] = useState<number>(1)
  // const [initialDistance, setInitialDistance] = useState<number>(0)
  // const canvasRef = useRef<HTMLCanvasElement>(null)
  // const fileInputRef = useRef<HTMLInputElement>(null)
  // const [coordinates, setCoordinates] = useState<string>('')
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<string>('');

  

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


  return (
    <div className="flex h-screen" style={{
      display: 'flex', 
      gap: '2px', // Reduced gap between columns
      padding: '5px' // Optional padding around the layout
    }}>
      
  
      {/* Column 1: SidePanel - smaller column */}
      <div className="p-2" style={{
        flexBasis: '25%', // Smaller column (25% of total width)
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          height: '500px', // Specific size for side panel div
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
      </div>

      {/* Column 2: ImageCanvas - larger column */}
      <div className="p-2" style={{ // Changed padding from 'p-8' to 'p-4'
        flexBasis: '25%', // Larger column (50% of total width)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div className="canvas-container" style={{
          height: '500px', // Specific size for the canvas div
          marginBottom: '20px',
          padding: '5px',
          backgroundColor: '#e0f7fa',
          border: '1px solid #ddd',
          borderRadius: '8px',
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
          />
        </div>
      </div>
  
        
      {/* Column 3: GeneratedPromptWindow + another div */}
      <div className="p-2" style={{
        flexBasis: '40%', // Maintain a wider column
        minWidth: '300px', // Set a minimum width for the column
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        {/* First div in the third column */}
        <div style={{
          height: '200px', // Specific size for the first div
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e0f7fa',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <GeneratedPromptWindow 
            coordinates={coordinates}
          />
        </div>
  
        {/* Second div in the third column */}
        <div style={{
          height: '400px', // Specific size for the second div
          padding: '10px',
          backgroundColor: '#f0f4c3',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h2 className="text-lg font-bold">Final Output</h2>

        </div>
      </div>
    </div>
  )  
  
}
