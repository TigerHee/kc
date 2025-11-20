import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M15.263 9.63a1 1 0 0 0-1.252-1.203l-3.867 1.137a1 1 0 0 0-.688.715l-.984 3.91a1 1 0 0 0 1.252 1.203l3.868-1.137a1 1 0 0 0 .687-.716zm-4.424 3.35.417-1.658 1.64-.483-.417 1.658z" />
        <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-9a9 9 0 1 0 0 18 9 9 0 0 0 0-18" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
