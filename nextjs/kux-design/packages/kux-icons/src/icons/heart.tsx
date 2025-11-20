import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 4.702a6.34 6.34 0 0 1 9.206 8.6c-1.572 2.11-2.906 3.388-5.214 5.26l-3.305 2.68a.96.96 0 0 1-1.191.014l-3.368-2.6c-2.134-1.646-3.401-2.91-5.218-5.203A6.34 6.34 0 0 1 3.942 4.55l.596.752-.596-.752A6.34 6.34 0 0 1 12 4.702m6.76 1.272a4.417 4.417 0 0 0-6.024.706.96.96 0 0 1-1.473 0 4.417 4.417 0 0 0-6.848 5.58c1.729 2.181 2.886 3.333 4.886 4.876l2.767 2.136 2.714-2.202c2.231-1.809 3.438-2.973 4.884-4.915a4.417 4.417 0 0 0-.906-6.181"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
