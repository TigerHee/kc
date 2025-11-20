import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20 9.5v7.8h1.396a1 1 0 1 1 0 2h-5.931a3.5 3.5 0 0 1-6.93 0H2.604a1 1 0 1 1 0-2H4V9.5a8 8 0 1 1 16 0m-14 0a6 6 0 1 1 12 0v7.8H6zm6 10.8a1.5 1.5 0 0 1-1.415-1h2.83a1.5 1.5 0 0 1-1.415 1"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
