import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M9.878 8.465a1 1 0 1 0-1.414 1.414L10.586 12l-2.122 2.122a1 1 0 1 0 1.414 1.414L12 13.415l2.121 2.121a1 1 0 0 0 1.415-1.414L13.414 12l2.122-2.121a1 1 0 0 0-1.415-1.414L12 10.586z" />
        <path
          fillRule="evenodd"
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
