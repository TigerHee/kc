import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M10.293 8.793a1 1 0 0 1 1.414 0l1.793 1.793 1.793-1.793a1 1 0 1 1 1.414 1.414L14.914 12l1.793 1.793a1 1 0 0 1-1.414 1.414L13.5 13.414l-1.793 1.793a1 1 0 0 1-1.414-1.414L12.086 12l-1.793-1.793a1 1 0 0 1 0-1.414" />
        <path
          fillRule="evenodd"
          d="M6.8 5.6A4 4 0 0 1 10 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H10a4 4 0 0 1-3.2-1.6l-3.9-5.2a2 2 0 0 1 0-2.4zM10 6h10v12H10a2 2 0 0 1-1.6-.8L4.5 12l3.9-5.2A2 2 0 0 1 10 6"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
