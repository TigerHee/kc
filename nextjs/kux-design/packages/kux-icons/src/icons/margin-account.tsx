import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18.6 2.6a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0M1.4 10.2a5.2 5.2 0 1 1 10.4 0 5.2 5.2 0 0 1-10.4 0M6.6 7a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4"
          clipRule="evenodd"
        />
        <path d="M22.516 14.149a1 1 0 0 0-.632-1.898l-18 6a1 1 0 0 0 .632 1.898l9.187-3.063-1.608 2.68a.66.66 0 0 0 .566 1h3.388a.66.66 0 0 0 .566-1l-1.825-3.042z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
