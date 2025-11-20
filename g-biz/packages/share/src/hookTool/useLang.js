import { useTranslation } from '@tools/i18n';

export default function useLang() {
  const translation = useTranslation('share');
  return translation;
}
