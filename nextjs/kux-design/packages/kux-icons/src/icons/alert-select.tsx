import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12 2.5a7 7 0 0 0-7 7v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a7 7 0 0 0-7-7m-.054 5.387c.16-.256.554-.142.554.159V11h.96a.3.3 0 0 1 .255.459l-1.659 2.654c-.16.255-.554.142-.554-.16V11h-.96a.3.3 0 0 1-.255-.459z"
          clipRule="evenodd"
        />
        <path d="M3.5 20a1 1 0 1 0 0 2h17a1 1 0 1 0 0-2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
