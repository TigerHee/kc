export function handlePlaceholder(placeholder: string | [string, string], label: string, shrink: boolean): [string, string] {
  if ((label && shrink) || !label) {
    if (Array.isArray(placeholder)) {
      return placeholder;
    }
    return [placeholder, placeholder];
  }
  return ['', ''];
} 