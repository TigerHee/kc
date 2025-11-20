import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.603 1.367a5 5 0 0 1 2.803 0l5.716 1.67A4 4 0 0 1 22 6.878v3.14a14.16 14.16 0 0 1-8.347 12.911 4.03 4.03 0 0 1-3.303 0A14.16 14.16 0 0 1 2 10.015V6.878a4 4 0 0 1 2.88-3.84zm4.854 7.13a1 1 0 0 1 0 1.414l-2.121 2.122 2.121 2.121a1 1 0 1 1-1.414 1.414l-2.121-2.121L9.8 15.568a1 1 0 0 1-1.414-1.414l2.121-2.121-2.12-2.122A1 1 0 0 1 9.8 8.497l2.121 2.121 2.122-2.12a1 1 0 0 1 1.414 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
