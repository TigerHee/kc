import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M2.587 19.914Q3.174 20.5 4 20.5h8a1 1 0 1 0 0-2H4v-13h15.5v5a1 1 0 1 0 2 0v-5q0-.825-.587-1.412A1.93 1.93 0 0 0 19.5 3.5H4q-.824 0-1.412.588A1.92 1.92 0 0 0 2 5.5v13q0 .824.588 1.413" />
        <path
          fillRule="evenodd"
          d="M13.62 8.6a1 1 0 0 1 .885.588l3.094 6.828 1.154-1.6a1 1 0 0 1 .811-.416H21.8a1 1 0 0 1 0 2h-1.724l-1.865 2.585a1 1 0 0 1-1.722-.172l-2.955-6.521-1.846 3.568a1 1 0 0 1-.888.54H7a1 1 0 1 1 0-2h3.191l2.515-4.86a1 1 0 0 1 .914-.54"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
