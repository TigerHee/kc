import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M1 7a4 4 0 0 1 4-4h15a3 3 0 0 1 3 3v1c0 1.12-.884 1.929-1.836 2.081-.662.106-1.487.335-2.123.794C18.452 10.299 18 10.929 18 12s.452 1.7 1.04 2.125c.637.459 1.462.688 2.124.794C22.116 15.07 23 15.88 23 17v1a3 3 0 0 1-3 3H5a4 4 0 0 1-4-4zm4-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-1l-.002-.008a.1.1 0 0 0-.022-.031.23.23 0 0 0-.128-.067c-.796-.128-1.974-.424-2.976-1.146C16.822 14.99 16 13.785 16 12s.822-2.991 1.872-3.748c1.002-.722 2.18-1.018 2.976-1.146a.23.23 0 0 0 .128-.067.1.1 0 0 0 .022-.031L21 7V6a1 1 0 0 0-1-1z" />
        <path d="M20 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
