import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M3.785 7.416a5.095 5.095 0 1 1 10.19 0 5.095 5.095 0 0 1-10.19 0M8.88 4.321a3.095 3.095 0 1 0 0 6.19 3.095 3.095 0 0 0 0-6.19M1.738 20.678c0-4.018 3.246-6.777 7.114-6.777 3.857 0 7.171 2.747 7.171 6.777a1 1 0 1 1-2 0c0-2.755-2.242-4.777-5.17-4.777-2.917 0-5.115 2.01-5.115 4.777a1 1 0 1 1-2 0M15.697 10a1 1 0 0 1 1-1h5.919a1 1 0 1 1 0 2h-5.919a1 1 0 0 1-1-1M16.828 14a1 1 0 0 1 1-1h3.656a1 1 0 0 1 0 2h-3.656a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
