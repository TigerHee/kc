import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 13.5a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1" />
        <path
          fillRule="evenodd"
          d="M12 1.5a6 6 0 0 0-6 6v2.024L5 9.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2L8 9.524V7.5a4 4 0 0 1 4-4c1.483 0 2.169 0 3.61 1.749.35.426.394 1 1 1 .605 0 1.434-.503 1.075-1.253C16.314 2.133 14.48 1.5 12 1.5m7 19v-9H5v9z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
