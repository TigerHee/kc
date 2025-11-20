import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.803 2.529A2.614 2.614 0 0 0 5.19 5.143v6.087a2.614 2.614 0 0 0-3.431 2.484v5.143a2.614 2.614 0 0 0 2.75 2.61h.681v.004h11.186a5.186 5.186 0 0 0 5.186-5.185V5.143a2.614 2.614 0 0 0-2.615-2.614zM6.99 5.143c0-.45.365-.814.814-.814h11.143c.45 0 .814.364.814.814v11.143a3.386 3.386 0 0 1-3.385 3.385H6.989zm-3.431 8.571a.814.814 0 0 1 1.628 0v5.143a.814.814 0 0 1-1.628 0zm6.726-3.691v4.034c0 .19.153.343.342.343h.947c.19 0 .343-.154.343-.343v-4.034h1.082a.343.343 0 0 0 .247-.58l-1.897-1.984a.343.343 0 0 0-.496 0L8.955 9.443a.343.343 0 0 0 .247.58zm4.576 3.954V9.943c0-.19.154-.343.343-.343h.962c.19 0 .343.154.343.343v4.034H17.6c.302 0 .457.364.246.581l-1.916 1.986a.343.343 0 0 1-.494 0l-1.916-1.986a.343.343 0 0 1 .246-.58z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
