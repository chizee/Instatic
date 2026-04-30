import React from 'react';
import type { IconProps } from '../types';

export function TabletSmartphoneSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="2" y="7" width="12" height="2" fill={color}/>
      <rect x="2" y="9" width="2" height="12" fill={color}/>
      <rect x="2" y="21" width="12" height="2" fill={color}/>
      <rect x="12" y="9" width="2" height="12" fill={color}/>
      <rect x="16" y="21" width="6" height="2" fill={color}/>
      <rect x="20" y="3" width="2" height="18" fill={color}/>
      <rect x="4" y="1" width="18" height="2" fill={color}/>
      <rect x="4" y="3" width="2" height="2" fill={color}/>
      <rect x="7" y="17" width="2" height="2" fill={color}/>
    </svg>
  );
}
