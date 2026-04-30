import React from 'react';
import type { IconProps } from '../types';

export function HeadphoneSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="14" y="13" width="7" height="2" fill={color}/>
      <rect x="16" y="19" width="5" height="2" fill={color}/>
      <rect x="14" y="13" width="2" height="8" fill={color}/>
      <rect x="19" y="5" width="2" height="14" fill={color}/>
      <rect x="3" y="13" width="7" height="2" fill={color}/>
      <rect x="3" y="19" width="5" height="2" fill={color}/>
      <rect x="3" y="5" width="2" height="14" fill={color}/>
      <rect x="8" y="13" width="2" height="8" fill={color}/>
      <rect x="5" y="3" width="14" height="2" fill={color}/>
    </svg>
  );
}
