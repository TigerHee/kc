import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M1 4.5a3 3 0 0 1 3-3h4.726a3 3 0 0 1 1.954.724l1.824 1.565h6.88a3 3 0 0 1 3 3v4.082a8 8 0 0 0-2-1.026V6.79a1 1 0 0 0-1-1h-7.25a1 1 0 0 1-.652-.241L9.377 3.74a1 1 0 0 0-.65-.241H4a1 1 0 0 0-1 1V19a1 1 0 0 0 1 1h6.009c.23.715.558 1.387.967 2H4a3 3 0 0 1-3-3z" />
        <path
          fillRule="evenodd"
          d="M18.525 11.72a.9.9 0 0 0-1.599 0l-1.416 2.738-3.04.5a.9.9 0 0 0-.495 1.52l2.166 2.193-.463 3.047a.9.9 0 0 0 1.293.94l2.755-1.383 2.754 1.383a.9.9 0 0 0 1.293-.94l-.463-3.047 2.166-2.192a.9.9 0 0 0-.494-1.52l-3.041-.501zm-1.623 3.966.823-1.593.824 1.593a.9.9 0 0 0 .654.474l1.769.292-1.26 1.275a.9.9 0 0 0-.25.768l.27 1.773-1.603-.804a.9.9 0 0 0-.807 0l-1.603.804.27-1.773a.9.9 0 0 0-.25-.768l-1.26-1.275 1.77-.292a.9.9 0 0 0 .653-.474"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
