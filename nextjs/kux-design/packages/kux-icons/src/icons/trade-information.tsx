import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13.05 9a1.05 1.05 0 1 0-2.1 0v6.68a1.05 1.05 0 1 0 2.1 0zM8.05 10.74a1.05 1.05 0 0 0-2.1 0v3.2a1.05 1.05 0 1 0 2.1 0zM17 9.69c.58 0 1.05.47 1.05 1.05v3.2a1.05 1.05 0 1 1-2.1 0v-3.2c0-.58.47-1.05 1.05-1.05" />
        <path
          fillRule="evenodd"
          d="M9 .948c-2.604 0-4.7.514-6.117 1.933C1.464 4.299.95 6.395.95 8.998v6c0 2.604.514 4.7 1.933 6.118C4.3 22.534 6.396 23.048 9 23.048h6c2.604 0 4.7-.514 6.118-1.932 1.418-1.419 1.932-3.514 1.932-6.118v-6c0-2.603-.514-4.7-1.933-6.117C19.7 1.462 17.605.948 15 .948zm-5.95 8.05c0-2.396.486-3.8 1.318-4.632C5.199 3.534 6.604 3.048 9 3.048h6c2.396 0 3.8.486 4.633 1.318.831.831 1.317 2.236 1.317 4.632v6c0 2.397-.486 3.8-1.317 4.633-.832.831-2.236 1.317-4.633 1.317H9c-2.396 0-3.8-.486-4.632-1.317-.832-.832-1.318-2.236-1.318-4.633z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
