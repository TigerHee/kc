import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H10a4 4 0 0 1-3.2-1.6l-3.9-5.2a2 2 0 0 1 0-2.4l3.9-5.2A4 4 0 0 1 10 4zM10 6a2 2 0 0 0-1.6.8L4.5 12l3.9 5.2a2 2 0 0 0 1.6.8h10V6zm5.293 2.793a1 1 0 0 1 1.414 1.414L14.914 12l1.793 1.793a1 1 0 1 1-1.414 1.414L13.5 13.414l-1.793 1.793a1 1 0 0 1-1.414-1.414L12.086 12l-1.793-1.793a1 1 0 0 1 1.414-1.414l1.793 1.793z"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
