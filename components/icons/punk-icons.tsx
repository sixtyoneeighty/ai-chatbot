import { SVGProps } from 'react';

export function SpikedHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L10 3L12 1L14 3L12 5Z M7 8L5 6L7 4L9 6L7 8Z M17 8L15 6L17 4L19 6L17 8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function SafetyPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M18 4c0-1.1-.9-2-2-2s-2 .9-2 2v2l4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V10l-4-4V4c0-1.1-.9-2-2-2S6 2.9 6 4v16c0 1.1.9 2 2 2s2-.9 2-2v-2l4-4v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Mohawk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2L14 6L12 4L10 6L8 4L6 6L4 4L2 6L4 8L6 6L8 8L10 6L12 8L14 6L16 8L18 6L20 8L22 6L20 4L18 6L16 4L14 6L12 2Z"
        fill="currentColor"
      />
      <circle cx="12" cy="15" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function GuitarPick(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2L20 10C22 12 22 15 20 17C18 19 15 19 13 17L7 11C5 9 5 6 7 4C9 2 12 2 14 4L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function Anarchy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 4L18 20M12 4L6 20M6 12H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
