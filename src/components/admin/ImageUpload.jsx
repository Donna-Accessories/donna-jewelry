import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import LoadingSpinner from '../ui/LoadingSpinner';

const ImageUpload = ({ currentImage, onUpload, loading }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-gold-primary bg-gold-50' : 'border-gray-300 hover:border-gold-primary'}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
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
