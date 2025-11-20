import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.754 4.204a7.5 7.5 0 1 0 9.042 9.042 6.409 6.409 0 0 1-9.042-9.042M2 11.5a9.5 9.5 0 0 1 11.424-9.305 1 1 0 0 1 .05 1.947 4.41 4.41 0 1 0 5.383 5.383 1 1 0 0 1 1.948.051A9.5 9.5 0 1 1 2 11.5"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
