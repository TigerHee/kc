/**
 * Owner: saiya.lee@kupotech.com
 */

export function BuildInfo() {
  return (
    <div style={{ paddingBottom: '20px'}}>
      <div style={{ color: '#888', fontSize: '14px'}}>
        文档构建时间: {process.env.BUILD_TIME}
      </div>
      <div style={{ color: '#777', fontSize: '14px' }}>
        对应组件库版本: <span style={
          {
            padding: '2px 5px',
            whiteSpace: 'nowrap',
            borderRadius: 3,
            fontSize: 13,
            border: '1px solid rgb(236, 244, 249)',
            color: 'rgba(46, 52, 56, 0.9)',
            backgroundColor: 'rgb(247, 250, 252)',
          }
        }>@kux/design@{process.env.PKG_VERSION}</span> <br />
        请使用不低于当前版本的组件库
      </div>
    </div>
  );
}

export function KuxIconInfo() {
  return (
    <div style={{ paddingBottom: '20px'}}>
      <div style={{ color: '#888', fontSize: '14px'}}>
        图标库 @kux/iconpack 版本: <span style={
          {
            padding: '2px 5px',
            whiteSpace: 'nowrap',
            borderRadius: 3,
            fontSize: 13,
            border: '1px solid rgb(236, 244, 249)',
            color: 'rgba(46, 52, 56, 0.9)',
            backgroundColor: 'rgb(247, 250, 252)',
          }
        }>@kux/iconpack@{process.env.KUX_ICON_PKG_VERSION}</span>
      </div>
    </div>
  );
}
