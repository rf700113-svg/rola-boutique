import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  href
}: {
  eyebrow?: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5 sm:mb-10">
      <div>
        {eyebrow ? (
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>
        ) : null}
        <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm text-charcoal underline underline-offset-8 transition hover:text-champagne">
          查看全部
        </Link>
      ) : null}
    </div>
  );
}
