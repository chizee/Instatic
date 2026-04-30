import React from 'react';
import type { IconProps } from '../types';

export function GalleryVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="8" width="8" height="2" transform="rotate(90 22 8)" fill={color}/>
      <rect x="20" y="6" width="2" height="16" transform="rotate(90 20 6)" fill={color}/>
      <rect x="4" y="8" width="8" height="2" transform="rotate(90 4 8)" fill={color}/>
      <rect x="20" y="16" width="2" height="16" transform="rotate(90 20 16)" fill={color}/>
      <rect x="22" y="20" width="2" height="20" transform="rotate(90 22 20)" fill={color}/>
      <rect x="22" y="2" width="2" height="20" transform="rotate(90 22 2)" fill={color}/>
    </svg>
  );
}
