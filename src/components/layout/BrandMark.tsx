// Mnemo's logo (assets/logo.svg): a stacked play mark over a bar and dot.
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M47 13L26 25.5L47 38Z" fill="#F3F1EC" stroke="#F3F1EC" strokeWidth="5" strokeLinejoin="round" opacity="0.35" />
      <path d="M37 13L16 25.5L37 38Z" fill="#F3F1EC" stroke="#F3F1EC" strokeWidth="5" strokeLinejoin="round" />
      <rect x="12" y="46" width="40" height="6" rx="3" fill="#F3F1EC" />
      <circle cx="47" cy="49" r="5" fill="#F3F1EC" />
    </svg>
  );
}
