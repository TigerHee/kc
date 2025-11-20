import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13 2a1 1 0 1 0-2 0v1.5a1 1 0 1 0 2 0zM4.221 4.221a1 1 0 0 1 1.415 0l1.06 1.061a1 1 0 1 1-1.414 1.414l-1.06-1.06a1 1 0 0 1 0-1.415M1 12a1 1 0 0 1 1-1h1.5a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1M6.696 18.717a1 1 0 0 0-1.414-1.415l-1.06 1.061a1 1 0 1 0 1.414 1.414zM17.303 17.305a1 1 0 0 1 1.414 0l1.061 1.06a1 1 0 0 1-1.414 1.414l-1.06-1.06a1 1 0 0 1 0-1.415M20.5 11a1 1 0 0 0 0 2H22a1 1 0 1 0 0-2zM19.778 4.222a1 1 0 0 1 0 1.415l-1.06 1.06a1 1 0 1 1-1.415-1.414l1.06-1.06a1 1 0 0 1 1.415 0" />
        <path
          fillRule="evenodd"
          d="M5.286 12a6.714 6.714 0 1 1 13.429 0 6.714 6.714 0 0 1-13.43 0M12 7.286a4.714 4.714 0 1 0 0 9.429 4.714 4.714 0 0 0 0-9.43"
          clipRule="evenodd"
        />
        <path d="M13 20.5a1 1 0 1 0-2 0V22a1 1 0 1 0 2 0z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
