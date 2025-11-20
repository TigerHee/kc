import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M16.593 9.978a.882.882 0 0 0-1.248-1.248L10.677 13.4l-2.022-2.023a.882.882 0 1 0-1.248 1.248l2.646 2.646a.88.88 0 0 0 1.248 0z"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
