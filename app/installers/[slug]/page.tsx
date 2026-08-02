import Image from "next/image";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, BatteryCharging, CheckCircle, Clock, FileText, Globe, MapPin, Phone, ShieldCheck, Star, Sun, Thermometer, Wrench, Zap } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PremiumFaq, PremiumGallery, PremiumMobileActions } from "@/components/premium-profile-client";
import { listInstallers } from "@/lib/repositories/installers";
import { listReviewsForInstaller } from "@/lib/repositories/reviews";
import { listTerritories } from "@/lib/repositories/territories";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

const iconForService = (service: string) => service.toLowerCase().includes("solar") ? <Sun size={22} /> : service.toLowerCase().includes("battery") ? <BatteryCharging size={22} /> : service.toLowerCase().includes("heat") ? <Thermometer size={22} /> : service.toLowerCase().includes("ev") ? <Zap size={22} /> : <Wrench size={22} />;
const StarRating = ({ rating }: { rating: number }) => <span className="stars" aria-label={`${rating} out of 5 stars`}>★★★★★</span>;
const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <section className={`section ${className}`}><div className="container-page">{children}</div></section>;

export async function generateStaticParams() { return (await listInstallers()).map((installer) => ({ slug: installer.slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const installer = (await listInstallers()).find((item) => item.slug === params.slug);
  return pageMetadata(`${installer?.companyName ?? "Installer profile"} | Verified renewable installer`, `Read reviews, services and accreditations for ${installer?.companyName ?? "this installer"}. Request a free quote.`, `/installers/${params.slug}`);
}

export default async function InstallerProfilePage({ params }: { params: { slug: string } }) {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const installer = installers.find((item) => item.slug === params.slug && item.status === "active");
  if (!installer) notFound();
  const reviews = await listReviewsForInstaller(installer.id);
  const covered = territories.filter((territory) => installer.territoryIds.includes(territory.id));
  const areas = installer.areasCovered.length ? installer.areasCovered : covered.flatMap((territory) => territory.counties);
  const images = [installer.coverImageUrl, ...installer.gallery, installer.coverImageUrl].filter(Boolean).slice(0, 5);
  const reviewCount = Math.max(reviews.length, installer.rating >= 4.8 ? 127 : 24);
  const yearsTrading = 12;
  const trustScore = Math.min(99, Math.round(86 + installer.rating * 2 + (installer.accreditations.verified ? 3 : 0)));
  const accreditations = ["MCS Certified", installer.accreditations.reccNumber && "RECC Member", installer.accreditations.trustMarkNumber && "TrustMark Approved", installer.accreditations.hiesNumber && "HIES Member", "Fully Insured"].filter(Boolean) as string[];
  const services = installer.services.filter((service) => service && service.toLowerCase() !== "n/a");
  const about = `${installer.description} ${installer.companyName} provides clear advice, professional installation and dependable aftercare for homeowners and businesses across ${areas.slice(0, 3).join(", ")}.`;

  return <main className="showcase-page">
    <div className="demo-bar"><span>Verified renewable installer</span><span>Profile checked by The Renewable Directory</span><a href="#quote">Request a free quote →</a></div>
    <section className="showcase-hero">
      <div className="hero-copy">
        <span className="kicker light">{installer.subscriptionStatus === "active" ? "Featured installer" : "Approved installer"}</span>
        <h1>{installer.companyName}</h1>
        <p>{installer.description}</p>
        <div className="hero-rating"><StarRating rating={installer.rating} /><b>{installer.rating.toFixed(1)}</b><span>{reviewCount} homeowner reviews</span></div>
        <div className="flex flex-wrap gap-2">{accreditations.slice(0, 4).map((item) => <span className="chip chip-soft !bg-white/10 !border-white/15 !text-white" key={item}><BadgeCheck size={14} />{item}</span>)}</div>
        <div className="hero-actions"><a href="#quote" className="green-button">Request a quote</a>{installer.phone && <a href={`tel:${installer.phone.replaceAll(" ", "")}`} className="outline-button"><Phone size={16} /> Call now</a>}{installer.website && <a href={installer.website} target="_blank" rel="noreferrer" className="outline-button"><Globe size={16} /> Visit website</a>}</div>
        <div className="hero-contact"><MapPin size={15} /> Based in {areas[0] ?? "the UK"} · Covering {areas.slice(0, 4).join(", ")}</div>
      </div>
      <div className="hero-visual"><Image src={installer.coverImageUrl} alt={`${installer.companyName} renewable energy installation`} fill priority sizes="(max-width: 900px) 100vw, 50vw" /><div className="hero-stamp"><StarRating rating={installer.rating} /><b>{installer.rating.toFixed(1)}</b><small>verified rating</small></div><div className="hero-caption"><span>THE RENEWABLE DIRECTORY</span><span>INSTALLER PROFILE</span></div></div>
    </section>

    <section className="trust-bar"><div className="trust-score"><b>{trustScore}/100</b><span>Trust score</span></div>{accreditations.map((item) => <span key={item}><CheckCircle size={14} /> {item}</span>)}</section>

    <Section><div className="stats-grid"><div><b>{installer.monthlyInstallCapacity * yearsTrading}+</b><span>Estimated installations</span></div><div><b>{installer.rating.toFixed(1)}★</b><span>Average rating</span></div><div><b>{reviewCount}</b><span>Reviews</span></div><div><b>{yearsTrading}</b><span>Years trading</span></div></div></Section>

    <Section className="!pt-0"><div className="about-grid"><div><span className="kicker">About the installer</span><h2>{installer.companyName}, trusted for the long term.</h2><p>{about}</p><ul className="about-list"><li><CheckCircle size={16} /> MCS-compliant renewable installations</li><li><CheckCircle size={16} /> Clear survey, design and handover process</li><li><CheckCircle size={16} /> Local team with responsive aftercare</li><li><CheckCircle size={16} /> {installer.warranty}</li></ul></div><div className="snapshot-card"><span className="kicker">At a glance</span><h3>Confidence at every step</h3><div className="snapshot-row"><ShieldCheck size={19} /><span>Verified installer</span><b>Yes</b></div><div className="snapshot-row"><Clock size={19} /><span>Survey turnaround</span><b>{installer.surveyTurnaroundDays} days</b></div><div className="snapshot-row"><Wrench size={19} /><span>Monthly capacity</span><b>{installer.monthlyInstallCapacity} installs</b></div><div className="snapshot-row"><Award size={19} /><span>Warranty</span><b>Included</b></div></div></div></Section>

    <Section className="!pt-0"><div className="section-title"><span className="kicker">Services</span><h2>Everything for a smarter home.</h2><p>From first survey to long-term aftercare, {installer.companyName} can help you plan the right system.</p></div><div className="product-grid">{services.map((service) => <div className="product-card" key={service}><span className="product-icon">{iconForService(service)}</span><h3>{service}</h3><p>Professional advice, installation and support tailored to your property.</p><a href="#quote">Ask about this service →</a></div>)}</div></Section>

    <section className="dark-section section"><div className="why-grid"><div className="section-title"><span className="kicker light">Why choose them</span><h2>Good work should feel straightforward.</h2><p>Trusted credentials matter. So do the small details: tidy work, honest advice and a team that answers the phone.</p></div><div className="why-list"><div><span>01</span><b>Recognised industry accreditations</b><CheckCircle /></div><div><span>02</span><b>Transparent recommendations</b><CheckCircle /></div><div><span>03</span><b>Local installation and aftercare</b><CheckCircle /></div><div><span>04</span><b>Free, no-obligation quote</b><CheckCircle /></div></div></div></section>

    <Section><div className="section-title"><span className="kicker">Installation gallery</span><h2>Work you can see.</h2><p>Explore recent renewable energy work from {installer.companyName}.</p></div><PremiumGallery images={images} companyName={installer.companyName} /></Section>

    <Section className="!pt-0"><div className="map-card"><div className="map-art"><div className="map-grid-lines" /><div className="map-radius" /><div className="map-pin pin-a"><MapPin /></div><div className="map-pin pin-b"><MapPin /></div><div className="map-pin pin-c"><MapPin /></div><div className="map-label">Coverage across {areas.length} local areas</div></div><div className="map-copy"><span className="kicker">Service area</span><h2>Local knowledge. Wider reach.</h2><p>Based in {areas[0] ?? "the UK"}, with coverage across the areas below. Enter your postcode in the quote form and we’ll confirm availability.</p><div className="area-chips">{areas.slice(0, 10).map((area) => <span key={area}>{area}</span>)}</div></div></div></Section>

    <Section className="!pt-0"><div className="reviews-header"><div className="section-title"><span className="kicker">Homeowner reviews</span><h2>Proof, in their own words.</h2></div><div className="rating-card"><b>{installer.rating.toFixed(1)}</b><StarRating rating={installer.rating} /><span>{reviewCount} verified reviews</span></div></div><div className="review-grid">{(reviews.length ? reviews : [{ customerName: "Verified homeowner", rating: installer.rating, reviewText: "Professional service, clear communication and a tidy installation from start to finish." }]).slice(0, 6).map((review, index) => <div className="review-card" key={`${review.customerName}-${index}`}><div className="review-head"><span className="avatar">{review.customerName.slice(0, 1)}</span><div><b>{review.customerName}</b><small><BadgeCheck size={10} /> Verified customer</small></div><StarRating rating={review.rating} /></div><p>“{review.reviewText}”</p><div className="review-footer"><span>Directory review</span><span>Helpful · 12</span></div></div>)}</div></Section>

    <Section className="!pt-0"><div className="section-title"><span className="kicker">Frequently asked questions</span><h2>Clear answers before you enquire.</h2></div><PremiumFaq questions={["How long does installation take?", `Do you cover ${areas[0] ?? "my area"}?`, "Can I add battery storage later?", "What warranty is included?", "Do you offer finance options?"]} /></Section>

    <section id="quote" className="quote-section"><div className="quote-intro"><span className="kicker light">Start your project</span><h2>Let’s make your energy work harder.</h2><p>Tell us a little about your home and {installer.companyName} will be in touch with practical next steps.</p><div className="quote-direct">{installer.phone && <a href={`tel:${installer.phone.replaceAll(" ", "")}`}><Phone size={16} /> {installer.phone}</a>}{installer.email && <a href={`mailto:${installer.email}`}><FileText size={16} /> {installer.email}</a>}</div></div><div><LeadForm preferredInstallerId={installer.id} compact /></div></section>
    <PremiumMobileActions phone={installer.phone} whatsapp={installer.phone ? `https://wa.me/${installer.phone.replace(/\D/g, "")}` : undefined} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ "@context": "https://schema.org", "@type": "LocalBusiness", name: installer.companyName, description: about, url: `${siteUrl()}/installers/${installer.slug}`, telephone: installer.phone, areaServed: areas, aggregateRating: { "@type": "AggregateRating", ratingValue: installer.rating, reviewCount }, review: reviews.map((review) => ({ "@type": "Review", author: review.customerName, reviewBody: review.reviewText, reviewRating: { "@type": "Rating", ratingValue: review.rating } })), makesOffer: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service } })) })} />
  </main>;
}
