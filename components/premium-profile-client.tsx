"use client";

import { ChevronDown, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";

export function PremiumGallery({ images, companyName }: { images: string[]; companyName: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <div className="showcase-gallery">
        {images.map((image, index) => (
          <button key={`${image}-${index}`} className={`gallery-tile gallery-tile-${index % 5}`} onClick={() => setSelected(image)} aria-label={`Open ${companyName} project photo ${index + 1}`}>
            <img src={image} alt={`${companyName} renewable installation`} loading={index > 1 ? "lazy" : "eager"} />
          </button>
        ))}
      </div>
      {selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close image"><X /></button><img src={selected} alt={`${companyName} installation enlarged`} /></div>}
    </>
  );
}

export function PremiumFaq({ questions }: { questions: string[] }) {
  const [open, setOpen] = useState(0);
  return <div className="faq-list">{questions.map((question, index) => <div className={`faq-item ${open === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button>{open === index && <p>Every project is different, so {question.toLowerCase().replace("?", "")} is confirmed during a clear, no-obligation survey. The team will explain your options and provide a tailored written quote.</p>}</div>)}</div>;
}

export function PremiumMobileActions({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return <div className="mobile-actions"><a href={phone ? `tel:${phone.replaceAll(" ", "")}` : "#quote"}><Phone size={17} /> Call</a><a className="mobile-enquire" href="#quote">Request quote</a><a href={whatsapp ?? "#quote"}><MessageCircle size={17} /> WhatsApp</a></div>;
}
