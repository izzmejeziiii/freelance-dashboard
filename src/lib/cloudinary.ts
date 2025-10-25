// Cloudinary upload utility
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('No secure URL returned from Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
