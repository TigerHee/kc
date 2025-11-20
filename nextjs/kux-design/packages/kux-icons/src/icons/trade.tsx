import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M4.136 5.636A8.98 8.98 0 0 1 10.5 3a8.98 8.98 0 0 1 6.364 2.636A8.98 8.98 0 0 1 19.5 12a8.98 8.98 0 0 1-2.636 6.364A8.98 8.98 0 0 1 10.5 21a8.98 8.98 0 0 1-6.364-2.636A8.98 8.98 0 0 1 1.5 12a8.98 8.98 0 0 1 2.636-6.364M10.5 5a6.98 6.98 0 0 0-4.95 2.05A6.98 6.98 0 0 0 3.5 12c0 1.933.782 3.682 2.05 4.95A6.98 6.98 0 0 0 10.5 19a6.98 6.98 0 0 0 4.95-2.05m0 0A6.98 6.98 0 0 0 17.5 12a6.98 6.98 0 0 0-2.05-4.95A6.98 6.98 0 0 0 10.5 5" />
        <path d="M17.571 3.515a1 1 0 0 1 1.414 0A11.97 11.97 0 0 1 22.5 12c0 3.313-1.344 6.315-3.515 8.485a1 1 0 0 1-1.414-1.414A9.97 9.97 0 0 0 20.501 12a9.97 9.97 0 0 0-2.93-7.071 1 1 0 0 1 0-1.414" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
