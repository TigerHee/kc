import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M17.97 3.709a3 3 0 0 0-4.244 0L5.085 12.36a2 2 0 0 0-.585 1.414V16a2 2 0 0 0 2 2h2.244a2 2 0 0 0 1.415-.586l8.635-8.64a3 3 0 0 0 0-4.24zm-2.83 1.414a1 1 0 0 1 1.415 0l.825.824a1 1 0 0 1 0 1.414L8.744 16H6.5v-2.226z"
          clipRule="evenodd"
        />
        <path d="M3.5 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
