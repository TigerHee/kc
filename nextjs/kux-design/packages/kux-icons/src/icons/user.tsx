import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 4c-1.905 0-3.483 1.592-3.483 3.517A3.494 3.494 0 0 0 12 11c1.905 0 3.483-1.592 3.483-3.517A3.494 3.494 0 0 0 12 4M6.517 7.517C6.517 4.507 8.971 2 12 2a5.494 5.494 0 0 1 5.483 5.483C17.483 10.493 15.029 13 12 13a5.494 5.494 0 0 1-5.483-5.483M8 16c-1.648 0-3 1.352-3 3v1h14v-1c0-1.648-1.352-3-3-3zm-5 3c0-2.752 2.248-5 5-5h8c2.752 0 5 2.248 5 5v1c0 1.102-.898 2-2 2H5c-1.102 0-2-.898-2-2z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
