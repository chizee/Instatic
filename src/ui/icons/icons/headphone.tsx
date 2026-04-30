import React from 'react';
import type { IconProps } from '../types';

export function HeadphoneIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="14" y="13" width="7" height="2" fill={color}/>
      <rect x="16" y="19" width="3" height="2" fill={color}/>
      <rect x="14" y="13" width="2" height="8" fill={color}/>
      <rect x="19" y="7" width="2" height="12" fill={color}/>
      <rect x="3" y="13" width="7" height="2" fill={color}/>
      <rect x="5" y="19" width="3" height="2" fill={color}/>
      <rect x="3" y="7" width="2" height="12" fill={color}/>
      <rect x="8" y="13" width="2" height="8" fill={color}/>
      <rect x="7" y="3" width="10" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="2" fill={color}/>
      <rect x="17" y="5" width="2" height="2" fill={color}/>
    </svg>
  );
}
