import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M14.601 13.506a1.001 1.001 0 0 1-.1 1.994 1 1 0 0 1-.995-.897L13.5 14.5a1 1 0 0 1 1-1.001zM14.4 14.99l.1.009c-.036 0-.07-.006-.104-.01z"
          clipRule="evenodd"
        />
        <path d="M14.018 8.943a.751.751 0 0 1 .942 1.157l-5 5-.118.096a.75.75 0 0 1-.943-1.157l5-5z" />
        <path
          fillRule="evenodd"
          d="M9.6 8.505a1 1 0 1 1-1.095 1.097L8.5 9.5a1 1 0 0 1 1-1zM9.4 9.99l.099.01q-.053-.002-.103-.011z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M21 4.25c.966 0 1.75.784 1.75 1.75v2.764c0 .427-.24.813-.615 1.006l.001.001-.043.024h-.002a2.484 2.484 0 0 0 .029 4.426l.007.003c.38.192.623.583.623 1.013V18c0 .966-.784 1.75-1.75 1.75H3c-.966 0-1.75-.784-1.75-1.75v-2.763c0-.43.243-.821.623-1.013l.28.553-.277-.554a2.485 2.485 0 0 0 0-4.446l.335-.67-.338.669a1.13 1.13 0 0 1-.623-1.012V6c0-.966.784-1.75 1.75-1.75zM3 5.75a.25.25 0 0 0-.25.25v2.545a3.984 3.984 0 0 1 0 6.908V18c0 .137.112.25.25.25h18c.137 0 .25-.113.25-.25v-2.546a3.982 3.982 0 0 1 0-6.906V6a.25.25 0 0 0-.25-.25z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
