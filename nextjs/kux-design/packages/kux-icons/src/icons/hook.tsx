import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22.209 4.795a1 1 0 0 1-.004 1.414l-13.062 13a1 1 0 0 1-1.41 0l-5.938-5.91a1 1 0 1 1 1.41-1.417l5.232 5.207L20.795 4.791a1 1 0 0 1 1.414.004"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
