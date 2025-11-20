import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 11.852a8.31 8.31 0 0 1 8.31 8.31.75.75 0 0 1-1.5 0 6.81 6.81 0 0 0-13.62 0 .75.75 0 0 1-1.5 0 8.31 8.31 0 0 1 8.31-8.31" />
        <path d="M12 15.212a.75.75 0 0 1 .75.75v1.35h1.35l.151.015a.75.75 0 0 1 0 1.47l-.151.015h-1.35v1.35a.75.75 0 0 1-1.5 0v-1.35H9.9a.75.75 0 0 1 0-1.5h1.35v-1.35a.75.75 0 0 1 .75-.75" />
        <path
          fillRule="evenodd"
          d="M12 2.612a4.11 4.11 0 1 1 0 8.22 4.11 4.11 0 0 1 0-8.22m0 1.5a2.61 2.61 0 1 0 0 5.22 2.61 2.61 0 0 0 0-5.22"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
