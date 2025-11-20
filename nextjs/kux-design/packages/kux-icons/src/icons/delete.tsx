import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M9 1.5a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zM4 4.5a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2zM10 12a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V13a1 1 0 0 1 1-1M14 12a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V13a1 1 0 0 1 1-1" />
        <path
          fillRule="evenodd"
          d="M6 7.5a2 2 0 0 0-2 2v10a3 3 0 0 0 3 3h9c2.657 0 4-1.343 4-3v-10a2 2 0 0 0-2-2zm0 2h12v10c0 .552-.448 1-2 1H7a1 1 0 0 1-1-1z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
