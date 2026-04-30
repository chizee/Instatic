import React from 'react';
import type { IconProps } from '../types';

export function FolderPlusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="6" height="2" fill={color}/>
      <rect x="4" y="18" width="10" height="2" fill={color}/>
      <rect x="20" y="8" width="2" height="6" fill={color}/>
      <rect x="2" y="6" width="2" height="12" fill={color}/>
      <rect x="10" y="6" width="10" height="2" fill={color}/>
      <rect x="22" y="18" width="2" height="6" transform="rotate(90 22 18)" fill={color}/>
      <rect x="18" y="16" width="2" height="6" fill={color}/>
    </svg>
  );
}
