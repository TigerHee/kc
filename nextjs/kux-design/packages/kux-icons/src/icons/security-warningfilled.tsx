import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.603 1.367a5 5 0 0 1 2.803 0l5.716 1.67A4 4 0 0 1 22 6.878v3.14a14.16 14.16 0 0 1-8.347 12.911 4.03 4.03 0 0 1-3.303 0A14.16 14.16 0 0 1 2 10.015V6.878a4 4 0 0 1 2.88-3.84zM13 7.5a1 1 0 1 0-2 .002l.004 5a1 1 0 1 0 2-.002zm0 8.001a1 1 0 0 0-2 0v.5a1 1 0 0 0 2 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
