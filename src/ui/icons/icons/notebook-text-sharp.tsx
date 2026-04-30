import React from 'react';
import type { IconProps } from '../types';

export function NotebookTextSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="18" height="2" fill={color}/>
      <rect x="4" y="20" width="18" height="2" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect x="4" y="4" width="2" height="16" fill={color}/>
      <rect x="2" y="7" width="6" height="2" fill={color}/>
      <rect x="10" y="7" width="6" height="2" fill={color}/>
      <rect x="10" y="11" width="8" height="2" fill={color}/>
      <rect x="10" y="15" width="6" height="2" fill={color}/>
      <rect x="2" y="11" width="6" height="2" fill={color}/>
      <rect x="2" y="15" width="6" height="2" fill={color}/>
    </svg>
  );
}
