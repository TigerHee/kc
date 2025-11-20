import { useVerification } from "../components/Verification/model";
import { SCENE } from "../enums";

export default function useModalSize() {
  const { scene } = useVerification();
  return [
    SCENE.PASSKEY,
    SCENE.PASSKEY_SUPPLEMENT,
    SCENE.ERROR_40016,
    SCENE.ERROR_40017,
    SCENE.ERROR_50005,
    SCENE.ERROR_500017,
    SCENE.ERROR_DEFAULT,
  ].includes(scene) ? 'small' : 'medium';
}