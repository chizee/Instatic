import React from 'react';
import type { IconProps } from '../types';

export function ToolCaseSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="11" width="20" height="2" fill={color}/>
      <rect x="2" y="13" width="2" height="8" fill={color}/>
      <rect x="2" y="21" width="20" height="2" fill={color}/>
      <rect x="20" y="13" width="2" height="8" fill={color}/>
      <rect x="9" y="15" width="6" height="2" fill={color}/>
      <rect x="4" y="8" width="2" height="3" fill={color}/>
      <rect x="4" y="6" width="10" height="2" fill={color}/>
      <rect x="12" y="8" width="2" height="3" fill={color}/>
      <rect x="8" y="2" width="2" height="4" fill={color}/>
      <rect x="18" y="3" width="2" height="8" fill={color}/>
      <rect x="8" y="2" width="12" height="2" fill={color}/>
    </svg>
  );
}
