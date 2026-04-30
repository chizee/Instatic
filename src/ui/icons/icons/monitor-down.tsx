import React from 'react';
import type { IconProps } from '../types';

export function MonitorDownIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="4" y="16" width="16" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="12" fill={color}/>
      <rect x="20" y="4" width="2" height="12" fill={color}/>
      <rect x="11" y="18" width="2" height="2" fill={color}/>
      <rect x="8" y="20" width="8" height="2" fill={color}/>
      <rect x="11" y="13" width="2" height="2" fill={color}/>
      <rect x="9" y="11" width="6" height="2" fill={color}/>
      <rect x="7" y="9" width="10" height="2" fill={color}/>
      <rect x="11" y="5" width="2" height="4" fill={color}/>
    </svg>
  );
}
