import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.476 5.5a.6.6 0 0 0-.455.99l4.939 5.768a1 1 0 0 1 .24.65v5.693l1.6.79v-6.482a1 1 0 0 1 .24-.65l4.94-5.769a.6.6 0 0 0-.456-.99zM4.501 7.791C3.057 6.104 4.256 3.5 6.476 3.5h11.048c2.22 0 3.419 2.604 1.975 4.291L14.8 13.278V21a1 1 0 0 1-1.443.897l-3.6-1.778a1 1 0 0 1-.557-.897v-5.944z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
