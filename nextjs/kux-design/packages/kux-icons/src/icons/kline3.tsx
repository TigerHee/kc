import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M19.57 3.994a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 1 1 3.83 3.83v8.353a3.001 3.001 0 1 1-3.83 3.829H7.26a3.001 3.001 0 1 1-3.83-3.83V7.825a3.001 3.001 0 1 1 3.83-3.83zM5.43 7.824v8.353a3 3 0 0 1 1.83 1.829h9.48a3 3 0 0 1 1.83-1.83V7.825a3 3 0 0 1-1.83-1.83H7.26a3 3 0 0 1-1.83 1.83m-1-3.83a1 1 0 1 0 0 2 1 1 0 0 0 0-2m15.14 14.012a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-15.14 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
