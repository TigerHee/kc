import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M10 10.5a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0zM8.293 15.293a1 1 0 0 1 1.404-.01l.008.007q.02.019.082.066c.083.062.22.154.41.25.378.188.976.394 1.803.394s1.425-.206 1.803-.395a2.7 2.7 0 0 0 .492-.315l.008-.007a1 1 0 0 1 1.404 1.424L15 16l.707.707-.001.001-.002.002-.003.003-.008.008-.02.02-.061.054a3 3 0 0 1-.2.161 4.7 4.7 0 0 1-.715.438c-.622.311-1.524.606-2.697.606s-2.075-.295-2.697-.606a4.7 4.7 0 0 1-.716-.438 3 3 0 0 1-.26-.215l-.02-.02-.008-.008-.003-.003-.002-.002S8.293 16.707 9 16l-.706.708a1 1 0 0 1-.001-1.415M16 10.5a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0z" />
        <path
          fillRule="evenodd"
          d="M16.78 3.625a1 1 0 0 0-1.56-1.25l-2 2.5q-.049.06-.086.125h-2.268a1 1 0 0 0-.085-.125l-2-2.5a1 1 0 0 0-1.562 1.25L8.319 5H8a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-7a5 5 0 0 0-5-5h-.32zM8 7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3z"
          clipRule="evenodd"
        />
        <path d="M2 12.5a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0zM23 11.5a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
