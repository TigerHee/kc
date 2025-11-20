export function reportExtension(params: any) {
  if (window.extensionDetector) {
    window.extensionDetector.detectAndReport({
      uid: params.uid,
      sence: 'login',
    });
  }
}
