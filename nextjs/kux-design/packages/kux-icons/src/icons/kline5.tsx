import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m6.848 17.015 1.692.034 9.633-9.36-1.725-1.725-9.634 9.36zm-.596 1.949A1.38 1.38 0 0 1 4.9 17.612l-.05-2.496a1.38 1.38 0 0 1 .404-1.004l10.218-9.944a1.38 1.38 0 0 1 1.952 0l2.546 2.546a1.38 1.38 0 0 1 0 1.951L9.75 18.61a1.38 1.38 0 0 1-1.002.404z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
