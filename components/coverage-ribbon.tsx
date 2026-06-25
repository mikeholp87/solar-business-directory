import type { ReactNode } from "react";

export type CoverageRibbonItem = {
  value: string;
  label: string;
};

type CoverageRibbonProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: CoverageRibbonItem[];
  footnote?: ReactNode;
  className?: string;
};

export function CoverageRibbon({ eyebrow, title, description, items, footnote, className }: CoverageRibbonProps) {
  return (
    <section className={`coverage-ribbon ${className ?? ""}`.trim()}>
      <div className="coverage-ribbon__bar" />
      <div className="grid gap-6 p-5 sm:p-6 lg:p-7">
        <div className="grid gap-3">
          <p className="eyebrow !inline-flex !w-fit !bg-white/68">{eyebrow}</p>
          <h2 className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
          <p className="max-w-2xl text-sm leading-7 text-navy/70">{description}</p>
        </div>
        <div className="coverage-ribbon__grid">
          {items.map((item) => (
            <div key={`${item.label}-${item.value}`} className="coverage-ribbon__item">
              <p className="text-2xl font-black tracking-tight text-navy">{item.value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-navy/54">{item.label}</p>
            </div>
          ))}
        </div>
        {footnote ? <div className="text-xs leading-6 text-navy/58">{footnote}</div> : null}
      </div>
    </section>
  );
}
