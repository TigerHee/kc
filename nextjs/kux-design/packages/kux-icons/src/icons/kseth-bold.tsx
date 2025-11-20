import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2.139c.274 0 .534.126.705.34l6.4 8.055a.9.9 0 0 1 .051 1.05l-6.401 9.866a.9.9 0 0 1-1.51 0l-6.4-9.866a.9.9 0 0 1 .05-1.05l6.4-8.055.068-.076A.9.9 0 0 1 12 2.14m0 17.168 4.743-7.313H7.257zm-4.535-9.114h9.07L12 4.484z"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
