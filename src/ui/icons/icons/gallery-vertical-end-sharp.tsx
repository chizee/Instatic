import React from 'react';
import type { IconProps } from '../types';

export function GalleryVerticalEndSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="10" width="12" height="2" transform="rotate(90 22 10)" fill={color}/>
      <rect x="20" y="10" width="2" height="16" transform="rotate(90 20 10)" fill={color}/>
      <rect x="4" y="10" width="12" height="2" transform="rotate(90 4 10)" fill={color}/>
      <rect x="20" y="20" width="2" height="16" transform="rotate(90 20 20)" fill={color}/>
      <rect x="20" y="6" width="2" height="16" transform="rotate(90 20 6)" fill={color}/>
      <rect x="18" y="2" width="2" height="12" transform="rotate(90 18 2)" fill={color}/>
    </svg>
  );
}
