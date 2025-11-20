import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.192 5.293a1 1 0 0 0 0 1.414L18.485 11H2.9a1 1 0 1 0 0 2h15.586l-4.293 4.293a1 1 0 0 0 1.415 1.414l6-6 .002-.002a1 1 0 0 0 .29-.705 1 1 0 0 0-.29-.705l-.003-.002-6-6a1 1 0 0 0-1.414 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
