import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 6a2 2 0 0 1 2-2h1a1 1 0 0 0 0-2H6a4 4 0 0 0-4 4v13a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4h-1.127a1 1 0 1 0 0 2H18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm7.996-4a1 1 0 0 1 1 1v11.59l2.797-2.797a1 1 0 0 1 1.414 1.414l-4.5 4.5a1 1 0 0 1-.71.293h-.001a1 1 0 0 1-.758-.348l-4.445-4.445a1 1 0 1 1 1.414-1.414l2.789 2.789V3a1 1 0 0 1 1-1"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
