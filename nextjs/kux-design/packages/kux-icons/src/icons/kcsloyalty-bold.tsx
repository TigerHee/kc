import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 3.3a1.9 1.9 0 0 1 1.9 1.9v.592h1.725c.98 0 1.774.795 1.774 1.776v1.337l-.01.31a4.4 4.4 0 0 1-2.421 3.625l-1.595.797a5.9 5.9 0 0 1-4.473 3.395V19.3H16a.9.9 0 0 1 0 1.8H8a.9.9 0 0 1 0-1.8h3.1v-2.268a5.9 5.9 0 0 1-4.474-3.395l-1.594-.797a4.4 4.4 0 0 1-2.42-3.625l-.012-.31V7.568c0-.98.795-1.776 1.775-1.776H6.1V5.2A1.9 1.9 0 0 1 8 3.3zM8 5.1a.1.1 0 0 0-.1.1v6a4.1 4.1 0 1 0 8.2 0v-6a.1.1 0 0 0-.1-.1zM4.4 7.594v1.312a2.6 2.6 0 0 0 1.437 2.325l.266.133q-.003-.08-.003-.163V7.593zM17.9 11.2q0 .082-.003.163l.265-.133A2.6 2.6 0 0 0 19.6 8.905V7.593h-1.7z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
