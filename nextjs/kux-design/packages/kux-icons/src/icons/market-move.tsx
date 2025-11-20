import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M18.458 1.925a1.05 1.05 0 0 1 1.485 0l2.25 2.25c.41.41.41.978 0 1.388l-2.25 2.25a1.05 1.05 0 0 1-1.486-1.485l.46-.458v-.02H5.5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a1 1 0 1 1 2 0v7a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4v-10a4 4 0 0 1 4-4h13.4l-.442-.44a1.05 1.05 0 0 1 0-1.485" />
        <path d="M11.867 8.35a1 1 0 0 1 1 1v7.5a1 1 0 1 1-2 0v-7.5a1 1 0 0 1 1-1M7.867 12.465a1 1 0 0 1 1 1v3.385a1 1 0 1 1-2 0v-3.385a1 1 0 0 1 1-1M16.867 11.64a1 1 0 1 0-2 0v5.21a1 1 0 0 0 2 0z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
