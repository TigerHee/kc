import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.062 6.675a6.81 6.81 0 0 1 5.454-2.722c3.446 0 6.302 2.567 6.758 5.89.402.186.95.48 1.493.902 1 .777 2.1 2.081 2.1 4.016 0 1.876-.838 3.215-1.908 4.067-1.033.822-2.281 1.192-3.211 1.217H5.553a5.57 5.57 0 0 1-3.835-1.687 5.56 5.56 0 0 1-1.584-3.9c0-2.04 1.11-3.891 2.845-4.869a4.076 4.076 0 0 1 5.083-2.914m-2.463 11.37h13.107c.518-.017 1.335-.247 2.008-.782.64-.51 1.152-1.294 1.152-2.503 0-1.086-.597-1.87-1.326-2.436a5.7 5.7 0 0 0-1.517-.835 1 1 0 0 1-.68-.806c-.008-.054-.01-.098-.01-.11a4.83 4.83 0 0 0-4.817-4.62A4.81 4.81 0 0 0 9.32 8.398a1.01 1.01 0 0 1-1.376.382 2.075 2.075 0 0 0-3.076 1.58 1.01 1.01 0 0 1-.595.815 3.59 3.59 0 0 0-2.138 3.284c0 .942.36 1.829 1.017 2.503A3.57 3.57 0 0 0 5.6 18.046"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
