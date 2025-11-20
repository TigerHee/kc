import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4H7V3a1 1 0 0 1 1-1m7 4v1a1 1 0 1 0 2 0V6h1.5a2 2 0 0 1 2 2v2h-17V8a2 2 0 0 1 2-2H7v1a1 1 0 0 0 2 0V6zM3.5 12v6a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
