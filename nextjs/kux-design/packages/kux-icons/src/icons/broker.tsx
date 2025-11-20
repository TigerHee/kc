import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M21.303 18.15a.93.93 0 0 1 1.256-.2.837.837 0 0 1 .21 1.2l-1.814 2.428c-.683.913-2.06 1.022-2.89.229l-1.85-1.768a.103.103 0 0 0-.151.01l-2.309 2.941a.93.93 0 0 1-1.26.172.836.836 0 0 1-.18-1.204l2.309-2.941c.693-.885 2.046-.977 2.864-.196l1.85 1.77a.104.104 0 0 0 .152-.013z" />
        <path d="M18.1 12.608c1.847 0 3.394 1.227 3.798 2.875.113.463-.301.852-.798.852s-.883-.401-1.09-.833a2.11 2.11 0 0 0-1.91-1.174h-11c-1.712 0-3.1 1.327-3.1 2.963v2.331c0 .581.493 1.051 1.1 1.051h4c.497 0 .9.386.9.861s-.403.86-.9.86h-4c-1.602 0-2.9-1.24-2.9-2.772v-2.33c0-2.587 2.194-4.684 4.9-4.684z" />
        <path
          fillRule="evenodd"
          d="M12.1.6C14.806.6 17 2.697 17 5.284s-2.194 4.684-4.9 4.684-4.9-2.097-4.9-4.684S9.394.6 12.1.6m0 1.721c-1.712 0-3.1 1.326-3.1 2.963 0 1.636 1.388 2.963 3.1 2.963s3.1-1.327 3.1-2.963-1.388-2.963-3.1-2.963"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
