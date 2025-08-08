"use client"

export function Resizer({ onPointerDown }: { onPointerDown: () => void }) {
  return (
    <div role="separator" aria-orientation="vertical" aria-label="Resize panels" className="relative group hidden lg:block">
      <div onMouseDown={onPointerDown} className="absolute inset-y-0 left-0 right-0 cursor-col-resize" />
      <div className="h-full w-[2px] mx-auto bg-[var(--border)] group-hover:bg-[var(--color-primary)] transition-colors" />
    </div>
  )
}
