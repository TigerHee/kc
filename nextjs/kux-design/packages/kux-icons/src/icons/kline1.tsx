import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.216 13a3.501 3.501 0 0 1-6.854-1 3.5 3.5 0 0 1 6.854-1h9.568a3.501 3.501 0 0 1 6.855 1 3.5 3.5 0 0 1-6.855 1zm-3.355.533a1.533 1.533 0 1 0 0-3.066 1.533 1.533 0 0 0 0 3.066m16.278 0a1.533 1.533 0 1 0 0-3.066 1.533 1.533 0 0 0 0 3.066"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
