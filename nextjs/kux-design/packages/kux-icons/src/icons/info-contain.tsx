import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1m.244 8.022h-1a1 1 0 1 0 0 2v5h-.755a1 1 0 0 0 0 2h3.516a1 1 0 1 0 0-2h-.76v-6a1 1 0 0 0-1-1m-.237-3.524a1.258 1.258 0 1 0 0 2.517 1.258 1.258 0 0 0 0-2.517"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
