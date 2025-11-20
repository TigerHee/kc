import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.192 9.707a1 1 0 0 0 1.415 0l4.292-4.293V21a1 1 0 1 0 2 0V5.414l4.293 4.293a1 1 0 0 0 1.415-1.414l-6-6-.003-.002a.997.997 0 0 0-1.41 0l-.002.002-6 6a1 1 0 0 0 0 1.414"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
