import { request } from '@umijs/max';

export function compressLottie(file: File) {
  // form-data
  const formData = new FormData();
  formData.append('file', file);

  return request('/lottie/compress', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function parseLottie(file: any) {
  // form-data
  const formData = new FormData();
  formData.append('file', file);
  return request('/lottie/parse', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
