import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSupabase } from '../../hooks/useSupabase';
import LoadingSpinner from '../ui/LoadingSpinner';

const ImageUpload = ({ currentImage, onUpload, loading: parentLoading }) => {
  const { supabase } = useSupabase();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length) return;
      const file = acceptedFiles[0];

      try {
        setUploading(true);

        // unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // get public URL
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        onUpload(data.publicUrl);
      } catch (err) {
        console.error('Upload failed:', err.message);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [supabase, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const isLoading = uploading || parentLoading;

  return (
    <div className="space-y-4">
      {/* Preview */}
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Product preview"
            className="w-full h-full object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-gold-primary
          ${isDragActive ? 'border-gold-primary bg-gold-50' : 'border-gray-300 hover:border-gold-primary'}`}
      >
        <input {...getInputProps()} aria-label="Upload product image" />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG or WebP (max. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
