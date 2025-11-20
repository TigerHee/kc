import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7m-1.06 2.44a1.5 1.5 0 1 1 2.12 2.12 1.5 1.5 0 0 1-2.12-2.12" />
        <path d="M12 4.5c-2.584 0-4.89 1.242-6.647 2.595-1.77 1.363-3.092 2.922-3.731 3.74a1.88 1.88 0 0 0 0 2.33c.639.818 1.962 2.377 3.731 3.74C7.111 18.258 9.416 19.5 12 19.5s4.89-1.242 6.647-2.595c1.77-1.363 3.092-2.922 3.731-3.74a1.88 1.88 0 0 0 0-2.33c-.639-.818-1.962-2.377-3.731-3.74C16.89 5.742 14.584 4.5 12 4.5M6.574 15.32c-1.54-1.185-2.72-2.555-3.324-3.32.603-.765 1.784-2.135 3.324-3.32C8.172 7.45 10.049 6.5 12 6.5s3.829.95 5.426 2.18c1.54 1.185 2.72 2.555 3.324 3.32-.603.765-1.784 2.135-3.324 3.32C15.83 16.55 13.951 17.5 12 17.5s-3.828-.95-5.426-2.18" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
