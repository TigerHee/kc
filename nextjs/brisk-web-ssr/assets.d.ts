declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '@/assets/*' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: any

  type ReactComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  export const ReactComponent: ReactComponent;

  export default content
}
