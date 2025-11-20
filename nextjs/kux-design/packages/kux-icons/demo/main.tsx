import { createRoot } from 'react-dom/client';
import { iconMap } from '../src/icon-map';

const iconList = Object.keys(iconMap);

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>所有图标预览</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {iconList.map((name ) => {
          // @ts-expect-error 这里是动态获取图标组件
          const IconComponent = iconMap[name];
          return <div key={name} style={{ width: 100, textAlign: 'center' }}>
            <IconComponent style={{ fontSize: 32 }} />
            <div style={{ fontSize: 12, marginTop: 8 }}>{name}</div>
          </div>
        })}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
