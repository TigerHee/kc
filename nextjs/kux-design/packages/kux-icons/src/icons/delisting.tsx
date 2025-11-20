import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M22.37 16.163c-.184.52-.781.738-1.283.508-.5-.23-.715-.823-.541-1.346a9.002 9.002 0 1 0-16.995.277c.19.518-.004 1.116-.497 1.363-.494.246-1.098.047-1.3-.466a11 11 0 1 1 20.616-.336" />
        <path
          fillRule="evenodd"
          d="m15.536 11.08-2.122-2.122a2 2 0 0 0-2.828 0L8.464 11.08a2 2 0 0 0 0 2.828l2.122 2.121a2 2 0 0 0 2.828 0l2.122-2.12a2 2 0 0 0 0-2.83M12 10.373l2.121 2.12L12 14.616l-2.121-2.121z"
          clipRule="evenodd"
        />
        <path d="M17.629 20.736A1 1 0 0 0 16.635 19l-4.109 2.06a1 1 0 0 1-1.003-.005L7.371 19a1 1 0 1 0-1.013 1.725l4.153 2.055a3 3 0 0 0 3.009.016z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
