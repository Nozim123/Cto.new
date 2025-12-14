export default function SectionHeader({ eyebrow, title, description, right }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80 mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="heading-medium">{title}</h2>
        {description && <p className="text-subtle mt-3 max-w-2xl">{description}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}
