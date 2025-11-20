import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="m14.102 2.2-.715-.477a2.5 2.5 0 0 0-2.774 0l-.715.476a11 11 0 0 0-4.87 8.368L2.28 13.414a1 1 0 0 0-.28.695V16.5a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2.391a1 1 0 0 0-.28-.695l-2.748-2.847a11 11 0 0 0-4.87-8.368m-2.38 1.187a.5.5 0 0 1 .555 0l.715.476A9 9 0 0 1 17 11.352V15.5H7v-4.148a9 9 0 0 1 4.008-7.489zM4 14.512l1-1.036V15.5H4zm16 .988h-1v-2.024l1 1.036z"
          clipRule="evenodd"
        />
        <path d="M13 19a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0zM8 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1M17 20a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
