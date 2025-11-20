import { IUser } from "@/types/ucenter.ts";

export function reportExtension(params: IUser) {
  if (window.extensionDetector) {
    window.extensionDetector.detectAndReport({
      uid: params.uid,
      sence: "login",
    });
  }
}
