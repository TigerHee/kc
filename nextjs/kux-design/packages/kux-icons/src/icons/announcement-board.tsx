import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M5 12a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M6 15a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" />
        <path
          fillRule="evenodd"
          d="M14.121 3.207a3 3 0 0 0-4.242 0L6.586 6.5H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2h-3.586zm-2.828 1.414a1 1 0 0 1 1.414 0L14.586 6.5H9.414zM3 8.5h18v11H3z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
