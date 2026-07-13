export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'suenos_dorados');

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/qdyil90c/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Error uploading image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};
