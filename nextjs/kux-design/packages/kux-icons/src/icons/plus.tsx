import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.031 4a1 1 0 0 1 .999 1.001L13.022 11H19a1 1 0 1 1 0 2h-5.98l-.008 6.001a1 1 0 1 1-2-.002L11.02 13H5a1 1 0 1 1 0-2h6.022l.008-6.001A1 1 0 0 1 12.031 4"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
