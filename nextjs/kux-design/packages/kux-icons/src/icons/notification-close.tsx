import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m5.033 5.959 1.57 1.57A6 6 0 0 0 6.4 9.083v7.8h9.558l2 2h-2.07a3.5 3.5 0 0 1-6.975 0H3a1 1 0 1 1 0-2h1.4v-7.8c0-1.108.225-2.164.633-3.124m8.796 13.124H10.97s.378 1.026 1.437 1.021c1.058-.005 1.422-1.02 1.422-1.02M5.47 1.293l1.72 1.719A8 8 0 0 1 20.4 9.083v7.139l1.936 1.937a1 1 0 0 1-1.414 1.414L4.057 2.707A1 1 0 1 1 5.47 1.293m6.929 1.79c-1.342 0-2.58.44-3.58 1.185l-.21.164 9.79 9.79V9.083a6 6 0 0 0-6-6"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
