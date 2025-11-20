import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18.524 2.712a2.7 2.7 0 0 1 .54 5.347v2.236a1.059 1.059 0 0 1-2.117 0V8.113h-6.63l-3.179 2.694v8.364h9.808v-1.862a1.059 1.059 0 0 1 2.118 0v2.899a1.08 1.08 0 0 1-1.08 1.08H6.1a1.08 1.08 0 0 1-1.08-1.08v-8.059a2.7 2.7 0 0 1-2.26-4.711l.578-.49a2.7 2.7 0 0 1 2.222-4.235zM9.112 4.83H5.837h.001-.277a.585.585 0 1 0-.001 1.172h2.164l-3.5 2.966-.044.042-.05.043a.583.583 0 1 0 .754.89l.068-.058.03-.023 4.553-3.86h8.998a.585.585 0 1 0-.01-1.173h-4.331l-.001.001h-3.275.001-1.805"
          clipRule="evenodd"
        />
        <path d="M21.767 12.322a1.06 1.06 0 0 0-1.395-.542l-4.793 2.11a1.059 1.059 0 0 0 .854 1.938l4.792-2.11c.535-.236.778-.86.542-1.396" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
