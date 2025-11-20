declare module '*.svg?react' {
  import * as React from 'react'

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string }
  >
  export default ReactComponent
}

declare module '*.png' {
  const src: string
  export default src
}
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png?url' {
  const src: string
  export default src
}

declare module '*.json?url' {
  const src: string
  export default src
}

declare module '*.svg?url' {
  const src: string
  export default src
}

/**
 * 是否为编辑器环境
 */
 
let _IS_EDITOR_: boolean
