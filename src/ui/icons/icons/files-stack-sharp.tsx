import React from 'react';
import type { IconProps } from '../types';

export function FilesStackSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="18" y="1" width="2" height="2" fill={color}/>
      <rect x="20" y="3" width="2" height="2" fill={color}/>
      <rect x="16" y="1" width="2" height="6" fill={color}/>
      <rect x="18" y="5" width="4" height="2" fill={color}/>
      <rect x="10" y="1" width="8" height="2" fill={color}/>
      <rect x="10" y="3" width="2" height="10" fill={color}/>
      <rect x="6" y="7" width="2" height="10" fill={color}/>
      <rect x="2" y="11" width="2" height="10" fill={color}/>
      <rect x="20" y="7" width="2" height="6" fill={color}/>
      <rect x="10" y="13" width="12" height="2" fill={color}/>
      <rect x="6" y="17" width="12" height="2" fill={color}/>
      <rect x="2" y="21" width="12" height="2" fill={color}/>
      <rect x="6" y="5" width="4" height="2" fill={color}/>
      <rect x="2" y="9" width="4" height="2" fill={color}/>
      <rect x="12" y="19" width="2" height="2" fill={color}/>
      <rect x="16" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
