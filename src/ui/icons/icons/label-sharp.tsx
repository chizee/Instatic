import React from 'react';
import type { IconProps } from '../types';

export function LabelSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="5" width="12" height="2" fill={color}/>
      <rect x="4" y="17" width="12" height="2" fill={color}/>
      <rect x="2" y="5" width="2" height="4" fill={color}/>
      <rect x="2" y="15" width="2" height="4" fill={color}/>
      <rect x="16" y="7" width="2" height="2" fill={color}/>
      <rect x="18" y="9" width="2" height="2" fill={color}/>
      <rect x="20" y="11" width="2" height="2" fill={color}/>
      <rect x="18" y="13" width="2" height="2" fill={color}/>
      <rect x="16" y="15" width="2" height="2" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="4" y="9" width="2" height="2" fill={color}/>
      <rect x="6" y="11" width="2" height="2" fill={color}/>
    </svg>
  );
}
