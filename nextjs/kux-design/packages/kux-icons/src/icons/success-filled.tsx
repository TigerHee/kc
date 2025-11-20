import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.222 4.222A10.97 10.97 0 0 1 12 1c3.037 0 5.789 1.232 7.778 3.222A10.97 10.97 0 0 1 23 12c0 3.037-1.232 5.789-3.222 7.778A10.97 10.97 0 0 1 12 23a10.97 10.97 0 0 1-7.778-3.222A10.97 10.97 0 0 1 1 12c0-3.037 1.232-5.789 3.222-7.778m13.485 5.485a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
