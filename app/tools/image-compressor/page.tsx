'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, Image as ImageIcon, UploadCloud, Loader2, Heart } from 'lucide-react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import { createClient } from '@/utils/supabase/client';
import { FileImage } from 'lucide-react';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const TOOL_ID = 14;
const TOOL_NAME = 'Image Compressor';
const TOOL_DESCRIPTION = 'Reduce the file size of images (PNG, JPG, WEBP).';

const pageHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginRight: '20px',
  color: '#ffffff',
};

const favoriteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pageContainerStyle: React.CSSProperties = {
    padding: '40px',
    color: '#e0e0e0',
    minHeight: 'calc(100vh - 80px)',
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#a0a0a0',
    marginBottom: '30px',
    maxWidth: '800px',
};

const placeholderContentStyle: React.CSSProperties = {
    border: '1px dashed #555',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#777',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}

export default function ImageCompressorPage() {
  const { addFavorite, removeFavorite, isFavorited, isLoading: favoritesLoading } = useFavorites();
  const [isClient, setIsClient] = useState(false);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedImagePreview, setCompressedImagePreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [quality, setQuality] = useState<number>(0.7);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('compressed-image.jpg');
  const [outputMimeType, setOutputMimeType] = useState<string>('image/jpeg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFavoriteToggle = () => {
    if (isFavorited(TOOL_ID)) {
      removeFavorite(TOOL_ID);
    } else {
      addFavorite(TOOL_ID);
    }
  };

  const isCurrentlyFavorited = isClient ? isFavorited(TOOL_ID) : false;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
        resetState();
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        resetState();
        return;
      }
      setError(null);
      setOriginalImage(file);
      setOriginalSize(file.size);
      setFileName(`compressed-${file.name.split('.').slice(0, -1).join('.')}.${file.type === 'image/png' ? 'png' : 'jpg'}`);
      setOutputMimeType(file.type === 'image/png' ? 'image/png' : 'image/jpeg');

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCompressedImagePreview(null);
      setCompressedSize(null);
    }
  };

  const resetState = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setOriginalSize(null);
    setCompressedImagePreview(null);
    setCompressedSize(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCompress = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setIsCompressing(true);

    const image = new Image();
    image.src = originalImagePreview!;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsCompressing(false);
        return;
      }
      ctx.drawImage(image, 0, 0);

      const mimeType = outputMimeType === 'image/png' && quality === 1 ? 'image/png' : 'image/jpeg';
      const actualQuality = mimeType === 'image/png' ? undefined : quality;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setCompressedImagePreview(reader.result as string);
              setCompressedSize(blob.size);
              const nameParts = originalImage.name.split('.').slice(0, -1);
              const extension = mimeType === 'image/png' ? 'png' : 'jpg';
              setFileName(`compressed-${nameParts.join('.')}.${extension}`);
              setIsCompressing(false);
            };
            reader.readAsDataURL(blob);
          } else {
            setError('Compression failed: could not create blob.');
            setIsCompressing(false);
          }
        },
        mimeType,
        actualQuality
      );
    };

    image.onerror = () => {
      setError('Could not load image for compression.');
      setIsCompressing(false);
    };
  }, [originalImage, originalImagePreview, quality, outputMimeType]);

  const handleDownload = () => {
    if (compressedImagePreview) {
      const link = document.createElement('a');
      link.href = compressedImagePreview;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div style={pageContainerStyle}>
      <div style={pageHeaderStyle}>
        <FileImage size={36} style={{ marginRight: '15px', color: '#00aaff' }} /> 
        <h1 style={titleStyle}>{TOOL_NAME}</h1>
        {isClient && (
          <button
            onClick={handleFavoriteToggle}
            disabled={favoritesLoading}
            style={favoriteButtonStyle}
            title={isCurrentlyFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
                size={28} 
                fill={isCurrentlyFavorited ? '#ff4444' : 'none'} 
                color={isCurrentlyFavorited ? '#ff4444' : 'currentColor'} 
            />
          </button>
        )}
      </div>
      <p style={descriptionStyle}>{TOOL_DESCRIPTION}</p>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
          <div>
            <Label htmlFor="image-upload" className="text-lg font-semibold">Upload Image</Label>
            <p className="text-sm text-muted-foreground mb-2">Select a JPEG, PNG, or WebP file (max {MAX_FILE_SIZE_MB}MB).</p>
            <Input
              id="image-upload"
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={triggerFileInput} variant="outline" className="w-full">
              <UploadCloud size={18} className="mr-2" /> Choose File
            </Button>
          </div>

          {originalImagePreview && (
            <>
              <div>
                <Label htmlFor="quality-slider" className="text-lg font-semibold">Compression Quality</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Adjust the quality ({Math.round(quality * 100)}%). Lower quality means smaller file size.
                  {outputMimeType === 'image/png' && ' (Quality slider mainly affects JPEG/WebP outputs). To get a compressed PNG, ensure quality is 100% and select PNG output if available, or the tool will output JPEG by default for quality < 100% from PNG input'}
                </p>
                <div className="flex items-center gap-4">
                  <Slider
                    id="quality-slider"
                    min={0.1} max={1} step={0.01}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    className="flex-grow"
                  />
                  <span className="text-sm font-medium w-12 text-right">{Math.round(quality * 100)}%</span>
                </div>
              </div>

              <div>
                <Label htmlFor="output-format" className="text-lg font-semibold">Output Format</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose the desired output format. PNG will be lossless if quality is 100%.
                </p>
                <select 
                  id="output-format"
                  value={outputMimeType}
                  onChange={(e) => setOutputMimeType(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-primary focus:border-primary"
                >
                  <option value="image/jpeg">JPEG (Lossy, best for photos)</option>
                  <option value="image/png">PNG (Lossless at 100% quality)</option>
                  <option value="image/webp">WebP (Good compression, modern format)</option>
                </select>
              </div>

              <Button onClick={handleCompress} disabled={isCompressing} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isCompressing ? <Loader2 size={18} className="mr-2 animate-spin" /> : <ImageIcon size={18} className="mr-2" />} 
                {isCompressing ? 'Compressing...' : 'Compress Image'}
              </Button>
            </>
          )}
        </div>

        <div className="space-y-6">
          {originalImagePreview && (
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Original Image</h3>
              <img src={originalImagePreview} alt="Original" className="rounded-md max-w-full max-h-80 object-contain mx-auto" />
              <p className="mt-2 text-center text-muted-foreground">Size: {originalSize ? formatBytes(originalSize) : 'N/A'}</p>
            </div>
          )}

          {isCompressing && (
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-primary mb-2" />
              <p className="text-muted-foreground">Compressing image, please wait...</p>
            </div>
          )}

          {compressedImagePreview && !isCompressing && (
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Compressed Image</h3>
              <img src={compressedImagePreview} alt="Compressed" className="rounded-md max-w-full max-h-80 object-contain mx-auto" />
              <div className="mt-3 text-center">
                 <p className="text-muted-foreground">New Size: <span className="font-semibold text-foreground">{compressedSize ? formatBytes(compressedSize) : 'N/A'}</span></p>
                {originalSize && compressedSize && (
                  <p className="text-primary font-semibold">
                    Saved: {formatBytes(originalSize - compressedSize)} ({( (originalSize - compressedSize) / originalSize * 100).toFixed(1)}%)
                  </p>
                )}
                 <Button onClick={handleDownload} className="mt-4 w-full sm:w-auto" variant="outline">
                    <Download size={18} className="mr-2" /> Download Compressed Image
                </Button>
              </div>
            </div>
          )}
          
          {!originalImagePreview && !isCompressing && (
             <div className="bg-black/20 backdrop-blur-xl p-10 rounded-lg border border-white/10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <ImageIcon size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload an image to begin compression.</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">{error}</p>
          )}
        </div>
      </div>

       <div className="max-w-6xl mx-auto mt-10 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
        <h3 className="text-xl font-semibold text-foreground mb-3">How to Use Image Compressor</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Click the "Choose File" button and select a JPEG, PNG, or WebP image from your device (max {MAX_FILE_SIZE_MB}MB).</li>
          <li>An original preview and its size will be displayed.</li>
          <li>Adjust the "Compression Quality" slider. Lower values typically result in smaller files but may reduce image quality (this primarily affects JPEG/WebP).</li>
          <li>Select your desired "Output Format" (JPEG, PNG, or WebP).</li>
          <li>Click the "Compress Image" button.</li>
          <li>A preview of the compressed image will appear along with its new size and the percentage saved.</li>
          <li>Click "Download Compressed Image" to save it.</li>
        </ol>
      </div>
    </div>
  );
} 