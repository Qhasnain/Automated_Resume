import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSmartLink(url: string, type: 'linkedin' | 'github' | 'portfolio' | 'email' | 'phone') {
  if (!url) return null;
  
  // Clean up URL for actual href
  let href = url;
  if (type === 'email' && !url.startsWith('mailto:')) href = `mailto:${url}`;
  if (type === 'phone' && !url.startsWith('tel:')) href = `tel:${url.replace(/[^0-9+]/g, '')}`;
  if (type !== 'email' && type !== 'phone' && !url.startsWith('http')) href = `https://${url}`;

  // Smart Label Formatting
  let label = url;
  if (type === 'linkedin') label = 'LinkedIn';
  else if (type === 'github') label = 'GitHub';
  else if (type === 'portfolio') label = 'Portfolio';
  else if (type === 'email') label = url.replace('mailto:', '');
  else if (type === 'phone') label = url.replace('tel:', '');

  return { href, label };
}
