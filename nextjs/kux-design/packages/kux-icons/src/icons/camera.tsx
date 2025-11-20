import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M10.162 8.957A4.9 4.9 0 0 1 12 8.6a4.88 4.88 0 0 1 3.139 1.137A.9.9 0 0 1 16.9 10v3.5a.9.9 0 0 1-.894.9H16a.9.9 0 0 1-.9-.9 3.1 3.1 0 0 0-4.262-2.875.9.9 0 0 1-.676-1.668M8.9 13.5a.9.9 0 0 0-1.8 0V17a.9.9 0 0 0 1.761.263A4.88 4.88 0 0 0 12 18.4c.648 0 1.269-.126 1.838-.356a.9.9 0 1 0-.676-1.669A3.1 3.1 0 0 1 8.9 13.5" />
        <path
          fillRule="evenodd"
          d="M9.62 2.01A2 2 0 0 0 7.84 3.1L6.87 5H4a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-2.885l-.968-1.899a2 2 0 0 0-1.782-1.091zM14.87 5l-.226-.445a1 1 0 0 0-.891-.545h-3.52a1 1 0 0 0-.89.545L9.114 5zM4 7a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
