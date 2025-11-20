import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.406 1.368a5 5 0 0 0-2.803 0l-5.724 1.67A4 4 0 0 0 2 6.878v3.136a14.16 14.16 0 0 0 8.35 12.914 4.03 4.03 0 0 0 3.303 0A14.16 14.16 0 0 0 22 10.017v-3.14a4 4 0 0 0-2.878-3.84zM12 5.25a4 4 0 0 0-4 4 1 1 0 1 0 2 0 2 2 0 1 1 2 2 1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-1.126a4.002 4.002 0 0 0-1-7.874m0 13.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
