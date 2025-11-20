import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M1 4a3 3 0 0 1 3-3h3a1 1 0 0 1 0 2H4a1 1 0 0 0-1 1v3a1 1 0 0 1-2 0zM23 17v3a3 3 0 0 1-3 3h-3a1 1 0 1 1 0-2h3a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0M8 7a1 1 0 0 0-2 0v1a1 1 0 0 0 2 0zM13 7a1 1 0 1 0-2 0v4.5c0 .175-.098.433-.332.668s-.493.332-.668.332h-.5a1 1 0 1 0 0 2h.5c.825 0 1.567-.402 2.082-.918.515-.515.918-1.257.918-2.082zM8.712 16.292a1 1 0 0 0-1.439 1.389l.001.001.002.001.003.004.008.008.023.023.072.069q.09.086.25.216c.214.173.522.397.918.62a6.96 6.96 0 0 0 3.418.889 7.14 7.14 0 0 0 4.374-1.499 5 5 0 0 0 .33-.282l.023-.022.008-.008.003-.003.002-.002h.001a1 1 0 0 0-1.411-1.418h-.001l-.002.002-.031.03a4.86 4.86 0 0 1-.818.564 5.14 5.14 0 0 1-2.478.638 4.96 4.96 0 0 1-2.44-.634 4.6 4.6 0 0 1-.636-.428 3 3 0 0 1-.177-.156zM18 7a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0zM4 23a3 3 0 0 1-3-3v-3a1 1 0 1 1 2 0v3a1 1 0 0 0 1 1h3a1 1 0 1 1 0 2zM23 4v3a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1h-3a1 1 0 1 1 0-2h3a3 3 0 0 1 3 3" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
