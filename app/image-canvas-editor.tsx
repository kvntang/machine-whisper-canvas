'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios'; // Ensure axios is imported
import GeneratedPrompt from './GeneratedPromptWindow'; // Import the new component
import SidePanel from './SidePanel'; // Import the new SidePanel component

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
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isScaling, setIsScaling] = useState(false)
  const [initialScale, setInitialScale] = useState<number>(1)
  const [initialDistance, setInitialDistance] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('')

  

  useEffect(() => {
    drawCanvas()
  }, [images, selectedImage, isScaling])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    images
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((image) => {
        const imgWidth = image.width * image.scale
        const imgHeight = image.height * image.scale

        ctx.save()
        ctx.translate(image.x, image.y)
        ctx.drawImage(image.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
        ctx.restore()

        if (image.id === selectedImage) {
          ctx.strokeStyle = 'blue'
          ctx.lineWidth = 2
          ctx.strokeRect(
            image.x - imgWidth / 2,
            image.y - imgHeight / 2,
            imgWidth,
            imgHeight
          )

          // Draw scaling anchor in the top right corner
          ctx.fillStyle = isScaling ? 'red' : 'blue'
          ctx.fillRect(
            image.x + imgWidth / 2 - 5,
            image.y - imgHeight / 2 - 5,
            10,
            10
          )
        }
      })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imgElement = new window.Image()
      imgElement.src = URL.createObjectURL(file)
      imgElement.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const imgWidth = imgElement.width
        const imgHeight = imgElement.height

        // Create a new image object with a sequential id starting from 1
        const newImage: Image = {
          id: images.length + 1, // Assigns id based on the current length of the images array
          file,
          x: canvas.width / 2,
          y: canvas.height / 2,
          scale: Math.min(1, canvas.width / imgWidth, canvas.height / imgHeight),
          zIndex: images.length,
          img: imgElement,
          width: imgWidth,
          height: imgHeight,
          caption: '', // Initialize caption as empty string
        }
        setImages([...images, newImage]) // Add the new image to the state array
      }
    }
  }

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    for (let i = images.length - 1; i >= 0; i--) {
      const image = images[i]
      const imgWidth = image.width * image.scale
      const imgHeight = image.height * image.scale

      const imageLeft = image.x - imgWidth / 2
      const imageTop = image.y - imgHeight / 2
      const imageRight = image.x + imgWidth / 2
      const imageBottom = image.y + imgHeight / 2

      if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
        setSelectedImage(image.id)

        // Check if clicking on scaling anchor
        const anchorSize = 10
        const anchorLeft = imageRight - 5
        const anchorTop = imageTop - 5

        if (
          x >= anchorLeft &&
          x <= anchorLeft + anchorSize &&
          y >= anchorTop &&
          y <= anchorTop + anchorSize
        ) {
          setIsScaling(true)
          setInitialScale(image.scale)
          const dx = x - image.x
          const dy = y - image.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          setInitialDistance(distance)
        } else {
          setIsDragging(true)
        }
        break
      }
    }
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (isDragging) {
      canvas.style.cursor = 'move'
      setImages((prevImages) =>
        prevImages.map((img) => {
          if (img.id === selectedImage) {
            return { ...img, x, y }
          }
          return img
        })
      )
    } else if (isScaling) {
      canvas.style.cursor = 'nesw-resize'
      setImages((prevImages) =>
        prevImages.map((img) => {
          if (img.id === selectedImage) {
            const dx = x - img.x
            const dy = y - img.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const scaleChange = distance / initialDistance
            const newScale = initialScale * scaleChange
            return { ...img, scale: Math.max(0.1, Math.min(newScale, 5)) } // Limit scale between 0.1 and 5
          }
          return img
        })
      )
    } else {
      // Change cursor style based on position
      let cursor = 'default'
      if (selectedImage !== null) {
        const img = images.find((img) => img.id === selectedImage)
        if (img) {
          const imgWidth = img.width * img.scale
          const imgHeight = img.height * img.scale

          const imageLeft = img.x - imgWidth / 2
          const imageTop = img.y - imgHeight / 2
          const imageRight = img.x + imgWidth / 2
          const imageBottom = img.y + imgHeight / 2

          const anchorSize = 10
          const anchorLeft = imageRight - 5
          const anchorTop = imageTop - 5

          if (
            x >= anchorLeft &&
            x <= anchorLeft + anchorSize &&
            y >= anchorTop &&
            y <= anchorTop + anchorSize
          ) {
            cursor = 'nesw-resize'
          } else if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
            cursor = 'move'
          }
        }
      }
      canvas.style.cursor = cursor
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setIsScaling(false)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.cursor = 'default'
    }
  }

  const handleCanvasMouseLeave = () => {
    setIsDragging(false)
    setIsScaling(false)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.cursor = 'default'
    }
  }

  const handleLayerChange = (direction: 'up' | 'down') => {
    if (selectedImage === null) return
    const currentIndex = images.findIndex((img) => img.id === selectedImage)
    const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1

    if (targetIndex < 0 || targetIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[currentIndex]
    newImages[currentIndex] = newImages[targetIndex]
    newImages[targetIndex] = temp

    // Update zIndex values
    newImages.forEach((img, index) => {
      img.zIndex = index
    })

    setImages(newImages)
  }

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
    <div className="flex h-screen">
      <div className="flex-1 p-8">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-gray-300"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseLeave}
        />

        {/* Buttons */}
        <div className="mt-4 flex space-x-2">
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button onClick={() => handleLayerChange('up')} disabled={selectedImage === null}>
            <ArrowUpCircle className="mr-2 h-4 w-4" /> Bring Forward
          </Button>
          <Button onClick={() => handleLayerChange('down')} disabled={selectedImage === null}>
            <ArrowDownCircle className="mr-2 h-4 w-4" /> Send Backward
          </Button>
        </div>

        {/* Generated Prompt Window */}
        <GeneratedPrompt generatedPrompt={generatedPrompt} />
      </div>

      {/* SidePanel */}
      <SidePanel
        images={images}
        selectedImage={selectedImage}
        handleDeleteImage={handleDeleteImage}
        handleCaptionChange={handleCaptionChange}
        setSelectedImage={setSelectedImage}
        setGeneratedPrompt={setGeneratedPrompt} // Pass the setGeneratedPrompt function
      />
    </div>
  )
}
