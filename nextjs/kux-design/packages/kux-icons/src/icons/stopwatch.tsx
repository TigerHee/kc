import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 9.1a.9.9 0 0 1 .9.9v3.627l2.237 2.236a.9.9 0 0 1-1.274 1.274l-2.5-2.5A.9.9 0 0 1 11.1 14v-4a.9.9 0 0 1 .9-.9" />
        <path
          fillRule="evenodd"
          d="M19.863 4.363a.9.9 0 0 1 1.274 1.274L19.092 7.68a9.5 9.5 0 1 1-1.321-1.226zM12 6.3a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4"
          clipRule="evenodd"
        />
        <path d="M17.1 1a.9.9 0 0 1 0 1.8H6.9a.9.9 0 1 1 0-1.8z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
