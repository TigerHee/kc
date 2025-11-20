import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M15.055 15.055a2.751 2.751 0 1 1 3.89 3.892 2.751 2.751 0 0 1-3.89-3.892m2.734.975a1.251 1.251 0 0 0-1.674 1.854 1.25 1.25 0 0 0 1.854-1.674l-.085-.095z"
          clipRule="evenodd"
        />
        <path d="M7.53 17.531a.751.751 0 0 1-1.062-1.06z" />
        <path d="M16.47 6.47a.75.75 0 0 1 1.06 1.061l-10 10-.53-.53-.532-.53z" />
        <path
          fillRule="evenodd"
          d="M5.055 5.055a2.75 2.75 0 1 1 3.89 3.89 2.75 2.75 0 0 1-3.89-3.89m2.734.975a1.251 1.251 0 1 0 .18.18l-.085-.094z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
