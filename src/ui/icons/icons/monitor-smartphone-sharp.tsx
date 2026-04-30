import React from 'react';
import type { IconProps } from '../types';

export function MonitorSmartphoneSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="2" width="18" height="2" fill={color}/>
      <rect x="1" y="12" width="12" height="2" fill={color}/>
      <rect x="1" y="4" width="2" height="8" fill={color}/>
      <rect x="17" y="4" width="2" height="4" fill={color}/>
      <rect x="9" y="14" width="2" height="2" fill={color}/>
      <rect x="7" y="16" width="6" height="2" fill={color}/>
      <rect x="15" y="10" width="8" height="2" fill={color}/>
      <rect x="15" y="12" width="2" height="8" fill={color}/>
      <rect x="15" y="20" width="8" height="2" fill={color}/>
      <rect x="21" y="12" width="2" height="8" fill={color}/>
    </svg>
  );
}
