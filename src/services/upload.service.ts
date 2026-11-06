import { api } from "../lib/api-client";


export interface UploadResponse {
  url: string;
  publicId?: string;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<UploadResponse>('/files/product-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
};