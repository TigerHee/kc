import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M11.996 2A9.8 9.8 0 0 0 5 4.908V4a1 1 0 1 0-2 0v3.978A1 1 0 0 0 4.02 9h3.37a1 1 0 1 0 0-2H5.812c1.453-1.834 3.664-3 6.184-3a8 8 0 0 1 7.169 4.445 1 1 0 1 0 1.79-.89A10 10 0 0 0 11.996 2M4.896 15.555a1 1 0 1 0-1.791.89A10 10 0 0 0 12.065 22a9.8 9.8 0 0 0 6.995-2.908V20a1 1 0 1 0 2 0v-3.978A1 1 0 0 0 20.04 15h-3.37a1 1 0 1 0 0 2h1.578c-1.452 1.834-3.664 3-6.183 3a8 8 0 0 1-7.17-4.445" />
        <path
          fillRule="evenodd"
          d="M8.5 10.62a2 2 0 0 0 0 2.83l2.122 2.12a2 2 0 0 0 2.828 0l2.122-2.12a2 2 0 0 0 0-2.83L13.45 8.5a2 2 0 0 0-2.828 0zm1.415 1.415 2.121-2.121 2.121 2.121-2.121 2.121z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
