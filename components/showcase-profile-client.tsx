"use client";

import { useState } from "react";
import { ChevronDown, X, ArrowRight, Check, Phone, MessageCircle } from "lucide-react";
import type { ShowcaseProfile } from "@/data/showcase-profiles";

export function Gallery({ profile }: { profile: ShowcaseProfile }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <>
    <div className="showcase-gallery">
      {profile.images.map((src, i) => <button key={`${src}-${i}`} onClick={() => setSelected(src)} className={`gallery-tile gallery-tile-${i % 5}`} aria-label={`Open project photo ${i + 1}`}><img src={src} alt="Renewable energy installation" loading={i > 2 ? "lazy" : "eager"} /></button>)}
    </div>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close"><X /></button><img src={selected} alt="Renewable energy installation enlarged" /></div>}
  </>;
}

export function FAQ() {
  const questions = ["How much can solar panels save me?", "Do you offer finance options?", "How long does an installation take?", "Will my home need a new roof?", "What happens after my installation?", "Are your installers MCS certified?", "Can I add a battery later?", "Do you work with listed buildings?", "What warranty is included?", "Can you install an EV charger too?", "How do I monitor my system?", "Do you handle all planning and paperwork?", "What areas do you cover?", "Can you remove old solar panels?", "How quickly can you provide a quote?"];
  const [open, setOpen] = useState(0);
  return <div className="faq-list">{questions.map((q, i) => <div className={`faq-item ${open === i ? "is-open" : ""}`} key={q}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><ChevronDown size={18} /></button>{open === i && <p>Every project is different, so we start with a clear, no-obligation survey and explain the options in plain English. Your dedicated team will provide a tailored answer and a transparent written quote.</p>}</div>)}</div>;
}

export function QuoteForm({ profile }: { profile: ShowcaseProfile }) {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="quote-success"><Check size={28} /><h3>Quote request received</h3><p>Thanks for your enquiry. {profile.name} will be in touch shortly.</p></div>;
  return <form className="quote-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><div className="quote-form-head"><span className="kicker">Start your project</span><h2>Request my free quote</h2><p>Tell us a little about your home and a local specialist will be in touch.</p></div><div className="form-grid"><label>Name<input required placeholder="Your full name" /></label><label>Phone<input required type="tel" placeholder="07123 456789" /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><label>Postcode<input required placeholder="CH1 1AA" /></label><label>Property type<select defaultValue=""><option value="" disabled>Select one</option><option>House</option><option>Bungalow</option><option>Commercial property</option></select></label><label>Roof type<select defaultValue=""><option value="" disabled>Select one</option><option>Pitched</option><option>Flat</option><option>Not sure</option></select></label></div><label>Monthly electricity bill<input placeholder="e.g. £180" /></label><label>How can we help?<textarea rows={4} placeholder="Tell us about your project..." /></label><button className="green-button" type="submit">Request My Free Quote <ArrowRight size={17} /></button><small>Free, no-obligation enquiry. Your details are kept private.</small></form>;
}

export function MobileActions({ profile }: { profile: ShowcaseProfile }) {
  return <div className="mobile-actions"><a href={`tel:${profile.phone.replaceAll(" ", "")}`}><Phone size={17} /> Call</a><a className="mobile-enquire" href="#quote"><ArrowRight size={17} /> Enquire</a><a href="https://wa.me/441244567890"><MessageCircle size={17} /> WhatsApp</a></div>;
}

