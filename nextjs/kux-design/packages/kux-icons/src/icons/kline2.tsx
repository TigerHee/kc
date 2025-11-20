import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.68 16.568a3.501 3.501 0 0 1-5.554 4.14 3.5 3.5 0 0 1 4.14-5.554l7.942-7.943a3.5 3.5 0 1 1 1.314 1.515zm-1.995 2.75a1.533 1.533 0 1 0-2.168-2.17 1.533 1.533 0 0 0 2.168 2.17M19.483 6.855a1.533 1.533 0 1 0-2.168-2.168 1.533 1.533 0 0 0 2.168 2.168"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
