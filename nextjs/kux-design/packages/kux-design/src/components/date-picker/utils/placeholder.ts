export function handlePlaceholder(placeholder: string, label: string, shrink: boolean) {
  if ((label && shrink) || !label) return placeholder;
  return '';
} 