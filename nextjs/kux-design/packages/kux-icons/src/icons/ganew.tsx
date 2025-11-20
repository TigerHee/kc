import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M14.777 8.94a.9.9 0 0 0-1.555-.908l-1.333 2.286-1.312-2.248a.9.9 0 0 0-1.555.907l1.289 2.209H7.7a.9.9 0 1 0 0 1.8h2.633l-1.31 2.246a.9.9 0 1 0 1.554.907l1.312-2.248 1.333 2.286a.9.9 0 1 0 1.555-.907l-1.332-2.284H16.1a.9.9 0 1 0 0-1.8h-2.633z" />
        <path
          fillRule="evenodd"
          d="M7.5.883a7 7 0 0 0-7 7V16.5a7 7 0 0 0 7 7h8.77a7 7 0 0 0 7-7V7.882a7 7 0 0 0-7-7zm-5 7a5 5 0 0 1 5-5h8.77a5 5 0 0 1 5 5V16.5a5 5 0 0 1-5 5H7.5a5 5 0 0 1-5-5z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
