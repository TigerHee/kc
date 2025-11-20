import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5 17.42a2 2 0 0 1-2-2V8.505a2 2 0 0 1 2-2h2.35q.086-.129.194-.28c.319-.452.785-1.058 1.374-1.667C10.057 3.378 11.83 2 14 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1c-2.176 0-3.951-1.405-5.088-2.602-.588-.619-1.373-1.692-1.373-1.692l-.23-.204zm3.766-9.424s-.063.164-.352.363c-.234.162-.508.146-.508.146H6a1 1 0 0 0-1 1v4.913a1 1 0 0 0 1 1h1.996s.288.035.512.207c.183.14.298.363.298.363l.06.1a12.539 12.539 0 0 0 1.495 1.933c.775.815 1.68 1.514 2.639 1.817V4.159c-.963.299-1.87.989-2.643 1.79a12.4 12.4 0 0 0-1.494 1.898z"
          clipRule="evenodd"
        />
        <path d="M17.32 15.738a1 1 0 1 0 1.329 1.495 7 7 0 0 0 .011-10.456 1 1 0 0 0-1.331 1.492 5 5 0 0 1-.008 7.47" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
