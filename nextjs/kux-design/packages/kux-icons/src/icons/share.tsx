import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14 4.414V7.5a1 1 0 0 1-1 1c-3.326 0-5.439 1.148-6.794 3.088-1.031 1.477-1.677 3.488-1.987 5.99C5.946 15.412 8.808 13 13 13a1 1 0 0 1 1 1v3.18l6.565-6.2zm-2-1.931c0-1.07 1.293-1.605 2.049-.849l8.367 8.368a1.4 1.4 0 0 1-.029 2.008l-8.363 7.898c-.765.723-2.024.18-2.024-.872v-3.977c-4.23.507-6.693 4.143-7.668 5.976-.327.614-.976.7-1.374.605-.401-.096-.963-.48-.945-1.206.103-4.023.813-7.5 2.554-9.991C6.199 8.106 8.652 6.753 12 6.533z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
