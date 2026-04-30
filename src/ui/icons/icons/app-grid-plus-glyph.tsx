import React from 'react';
import type { IconProps } from '../types';

export function AppGridPlusGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="9" height="9" fill={color}/>
      <rect x="2" y="13" width="9" height="9" fill={color}/>
      <rect x="13" y="2" width="9" height="9" fill={color}/>
      <rect x="17" y="14" width="2" height="8" fill={color}/>
      <rect x="22" y="17" width="2" height="8" transform="rotate(90 22 17)" fill={color}/>
    </svg>
  );
}
