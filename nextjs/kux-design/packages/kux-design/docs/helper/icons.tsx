import React, { useState, type ComponentType } from 'react';
import { iconMap, type IIconProps } from '@kux/iconpack/icon-map';
import { copyToClipboard } from '@/common';
import { toast } from '@/components';

const iconNames = Object.keys(iconMap).sort((a, b) => a.localeCompare(b));

export function IconShowCase(props: IIconProps) {
  const [search, setSearch] = useState('');
  const [color, setColor] = useState('#8c8c8c');
  const [compact, setCompact] = useState(false);

  // 过滤图标名称
  const filteredIconNames = iconNames.filter(name =>
    name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const onClickList = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const iconNode = target.closest('[data-icon-name]'); // 确保点击的是图标容器
    if (!iconNode) return; // 如果没有找到图标容器，直接返回
    const iconName = iconNode.getAttribute('data-icon-name')!;
    copyToClipboard(iconName);
    toast.success(`已复制图标名称: ${iconName}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>图标颜色</span>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ width: 32, height: 32, border: 'none', background: 'none' }}
            title="选择图标颜色"
          />
        </div>
        <label>
          <input
            type="checkbox"
            checked={compact}
            onChange={e => setCompact(e.target.checked)}
          />
          紧凑模式
        </label>
        <input
          type="text"
          placeholder={`搜索图标名称, 共 ${iconNames.length} 个图标`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '6px 8px', fontSize: 14, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <span style={{color: 'rgba(140, 140, 140, 0.8)', fontSize: 12}}>点击图标复制名称</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 10 : 24 }} onClick={onClickList}>
        {filteredIconNames.map((name) => {
          // @ts-expect-error ignore
          const Icon = iconMap[name] as unknown as ComponentType<IIconProps>;
          if (!Icon) {
            console.warn(`图标 ${name} 未找到`);
            return null;
          }
          return (<div
            key={name}
            style={{ width: compact ? 'auto': 80, textAlign: 'center', cursor: 'pointer' }}
            data-icon-name={name}>
            <Icon {...props} style={{ ...(props.style || {}), color }} />
            {!compact && <div style={{ color: 'rgb(140, 140, 140)', fontSize: 12, marginTop: 8, wordBreak: 'break-all' }}>{name}</div>}
          </div>)
        })}
        {filteredIconNames.length === 0 && (
          <div style={{ width: '100%', color: '#aaa', fontSize: 14, textAlign: 'center' }}>
            未找到 <code>{search}</code> 相关图标
          </div>
        )}
      </div>
    </div>
  );
}