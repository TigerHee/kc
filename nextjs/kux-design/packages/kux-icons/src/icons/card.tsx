import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M14 13a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" />
        <path
          fillRule="evenodd"
          d="M1 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4zm4-2a2 2 0 0 0-2 2v1.5h18V7a2 2 0 0 0-2-2zM3 17v-6.5h18V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
