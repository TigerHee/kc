import { UserResponse } from '@/api/ucenter';

export function reportExtension(params: UserResponse) {
  if (window.extensionDetector) {
    window.extensionDetector.detectAndReport({
      uid: params.uid,
      sence: 'login',
    });
  }
}
