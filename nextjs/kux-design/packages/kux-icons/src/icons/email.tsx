import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M1 7.5a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4zm4-2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z" />
        <path d="M2.19 4.915a1 1 0 0 1 1.396-.226L12 10.767l8.415-6.078a1 1 0 0 1 1.17 1.622l-9 6.5a1 1 0 0 1-1.17 0l-9-6.5a1 1 0 0 1-.226-1.396" />
        <path d="M1.25 7.5A3.75 3.75 0 0 1 5 3.75h7a.75.75 0 0 1 0 1.5H5A2.25 2.25 0 0 0 2.75 7.5V12a.75.75 0 0 1-1.5 0z" />
        <path d="M11.25 4.5a.75.75 0 0 1 .75-.75h7a3.75 3.75 0 0 1 3.75 3.75V12a.75.75 0 0 1-1.5 0V7.5A2.25 2.25 0 0 0 19 5.25h-7a.75.75 0 0 1-.75-.75" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
