import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M7.5.5a4 4 0 0 0-4 4v1h-1a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h1v1a4 4 0 0 0 4 4h2a1 1 0 1 0 0-2h-2a2 2 0 0 1-2-2v-1h1a1 1 0 1 0 0-2h-1v-3h1a1 1 0 1 0 0-2h-1v-3h1a1 1 0 0 0 0-2h-1v-1a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a1 1 0 1 0 2 0v-4a4 4 0 0 0-4-4z" />
        <path d="M18.945 11.668a1 1 0 0 1 1.387.277l2 3A1 1 0 0 1 21.5 16.5h-8a1 1 0 1 1 0-2h6.131l-.963-1.445a1 1 0 0 1 .277-1.387M14.668 23.055a1 1 0 0 0 1.664-1.11l-.964-1.445H21.5a1 1 0 1 0 0-2h-8a1 1 0 0 0-.832 1.555z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
