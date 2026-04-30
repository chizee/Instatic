import React from 'react';
import type { IconProps } from '../types';

export function MailboxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="18" width="22" height="2" fill={color}/>
      <rect x="1" y="8" width="2" height="10" fill={color}/>
      <rect x="5" y="4" width="14" height="2" fill={color}/>
      <rect x="3" y="6" width="2" height="2" fill={color}/>
      <rect x="7" y="6" width="2" height="2" fill={color}/>
      <rect x="19" y="6" width="2" height="2" fill={color}/>
      <rect x="9" y="8" width="2" height="10" fill={color}/>
      <rect x="21" y="8" width="2" height="10" fill={color}/>
      <rect x="5" y="10" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="4" height="2" fill={color}/>
      <rect x="16" y="12" width="2" height="2" fill={color}/>
    </svg>
  );
}
