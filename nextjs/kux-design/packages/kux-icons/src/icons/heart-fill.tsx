import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20.074 4.485a5.92 5.92 0 0 1 1.214 8.284c-1.661 2.232-3.06 3.576-5.559 5.603l-3.638 2.95-3.709-2.862c-2.275-1.756-3.61-3.086-5.562-5.549A5.92 5.92 0 0 1 12 5.432a5.92 5.92 0 0 1 8.074-.947"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
