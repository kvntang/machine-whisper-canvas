import React, { useEffect, useRef } from 'react';
import { Upload, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Image {
  id: number;
  file: File;
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  img: HTMLImageElement;
  width: number;
  height: number;
  caption: string;
}

interface ImageCanvasProps {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  selectedImage: number | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<number | null>>;
  setCoordinates: React.Dispatch<React.SetStateAction<string>>;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  images,
  setImages,
  selectedImage,
  setSelectedImage,
  setCoordinates,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isScaling, setIsScaling] = React.useState(false);
  const [initialScale, setInitialScale] = React.useState<number>(1);
  const [initialDistance, setInitialDistance] = React.useState<number>(0);

  useEffect(() => {
    drawCanvas();
  }, [images, selectedImage, isScaling]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    images.sort((a, b) => a.zIndex - b.zIndex).forEach((image) => {
      const imgWidth = image.width * image.scale;
      const imgHeight = image.height * image.scale;

      ctx.save();
      ctx.translate(image.x, image.y);
      ctx.drawImage(image.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      ctx.restore();

      if (image.id === selectedImage) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          image.x - imgWidth / 2,
          image.y - imgHeight / 2,
          imgWidth,
          imgHeight
        );

        ctx.fillStyle = isScaling ? 'red' : 'blue';
        ctx.fillRect(
          image.x + imgWidth / 2 - 5,
          image.y - imgHeight / 2 - 5,
          10,
          10
        );
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imgElement = new window.Image();
      imgElement.src = URL.createObjectURL(file);
      imgElement.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const imgWidth = imgElement.width;
        const imgHeight = imgElement.height;

        const newImage: Image = {
          id: images.length + 1,
          file,
          x: canvas.width / 2,
          y: canvas.height / 2,
          scale: Math.min(1, canvas.width / imgWidth, canvas.height / imgHeight),
          zIndex: images.length,
          img: imgElement,
          width: imgWidth,
          height: imgHeight,
          caption: '',
        };
        setImages([...images, newImage]);
      };
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = images.length - 1; i >= 0; i--) {
      const image = images[i];
      const imgWidth = image.width * image.scale;
      const imgHeight = image.height * image.scale;

      const imageLeft = image.x - imgWidth / 2;
      const imageTop = image.y - imgHeight / 2;
      const imageRight = image.x + imgWidth / 2;
      const imageBottom = image.y + imgHeight / 2;

      if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
        setSelectedImage(image.id);

        const anchorSize = 10;
        const anchorLeft = imageRight - 5;
        const anchorTop = imageTop - 5;

        if (x >= anchorLeft && x <= anchorLeft + anchorSize && y >= anchorTop && y <= anchorTop + anchorSize) {
          setIsScaling(true);
          setInitialScale(image.scale);
          const dx = x - image.x;
          const dy = y - image.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          setInitialDistance(distance);
        } else {
          setIsDragging(true);
        }
        break;
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDragging) {
      canvas.style.cursor = 'move';
      setImages((prevImages) =>
        prevImages.map((img) => {
          if (img.id === selectedImage) {
            return { ...img, x, y };
          }
          return img;
        })
      );
    } else if (isScaling) {
      canvas.style.cursor = 'nesw-resize';
      setImages((prevImages) =>
        prevImages.map((img) => {
          if (img.id === selectedImage) {
            const dx = x - img.x;
            const dy = y - img.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scaleChange = distance / initialDistance;
            const newScale = initialScale * scaleChange;
            return { ...img, scale: Math.max(0.1, Math.min(newScale, 5)) };
          }
          return img;
        })
      );
    } else {
      let cursor = 'default';
      if (selectedImage !== null) {
        const img = images.find((img) => img.id === selectedImage);
        if (img) {
          const imgWidth = img.width * img.scale;
          const imgHeight = img.height * img.scale;

          const imageLeft = img.x - imgWidth / 2;
          const imageTop = img.y - imgHeight / 2;
          const imageRight = img.x + imgWidth / 2;
          const imageBottom = img.y + imgHeight / 2;

          const anchorSize = 10;
          const anchorLeft = imageRight - 5;
          const anchorTop = imageTop - 5;

          if (x >= anchorLeft && x <= anchorLeft + anchorSize && y >= anchorTop && y <= anchorTop + anchorSize) {
            cursor = 'nesw-resize';
          } else if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
            cursor = 'move';
          }
        }
      }
      canvas.style.cursor = cursor;
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsScaling(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  };

  const handleCanvasMouseLeave = () => {
    setIsDragging(false);
    setIsScaling(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  };

  const handleLayerChange = (direction: 'up' | 'down') => {
    if (selectedImage === null) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage);
    const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[currentIndex];
    newImages[currentIndex] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    newImages.forEach((img, index) => {
      img.zIndex = index;
    });

    setImages(newImages);
  };

  return (
    <div className="canvas-container" style={{
      marginBottom: '20px',
      width: '625px',
      padding: '10px',
    }}>
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

    </div>
  );
};

export default ImageCanvas;
