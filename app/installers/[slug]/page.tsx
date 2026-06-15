import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Timer, Wrench } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { listInstallers } from "@/lib/repositories/installers";
import { listReviewsForInstaller } from "@/lib/repositories/reviews";
import { listTerritories } from "@/lib/repositories/territories";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

export async function generateStaticParams() {
  const installers = await listInstallers();
  return installers.map((installer) => ({ slug: installer.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const installers = await listInstallers();
  const installer = installers.find((item) => item.slug === params.slug);
  return pageMetadata(installer?.companyName ?? "Installer profile", `View ${installer?.companyName ?? "installer"} BUS and MCS heat pump profile.`, `/installers/${params.slug}`);
}

export default async function InstallerProfilePage({ params }: { params: { slug: string } }) {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const installer = installers.find((item) => item.slug === params.slug && item.status === "active");
  if (!installer) notFound();
  const coveredTerritories = territories.filter((territory) => installer.territoryIds.includes(territory.id));
  const installerReviews = await listReviewsForInstaller(installer.id);

  return (
    <main>
      <section className="relative min-h-[420px] overflow-hidden">
        <Image src={installer.coverImageUrl} alt={`${installer.companyName} renewable energy installation`} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/60 to-transparent" />
        <div className="container-page relative flex min-h-[420px] items-end py-12 text-white">
          <div className="surface-card max-w-3xl bg-ink/72 p-6 backdrop-blur-md sm:p-8">
            <div className="flex flex-wrap items-start gap-5">
              <div className="grid size-16 place-items-center rounded-2xl bg-white text-2xl font-black text-fern shadow-soft">{installer.logoUrl}</div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow border-white/20 bg-white/10 text-white/70">Installer profile</p>
                <h1 className="mt-3 text-4xl font-black sm:text-5xl">{installer.companyName}</h1>
                <p className="mt-4 text-lg leading-8 text-white/86">{installer.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-page grid gap-8 lg:grid-cols-[0.64fr_0.36fr]">
          <div className="grid gap-6">
            <div className="surface-card p-6">
              <h2 className="text-2xl font-black">Accreditations</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="flex items-center gap-2"><BadgeCheck className="text-fern" size={18} /> MCS: {installer.accreditations.verified ? installer.accreditations.mcsNumber : "Verification pending"}</p>
                <p className="flex items-center gap-2"><BadgeCheck className="text-fern" size={18} /> BUS registered: {installer.accreditations.busRegistered ? "Yes" : "Pending"}</p>
                {installer.accreditations.reccNumber ? <p>RECC: {installer.accreditations.reccNumber}</p> : null}
                {installer.accreditations.trustMarkNumber ? <p>TrustMark: {installer.accreditations.trustMarkNumber}</p> : null}
                {installer.accreditations.hiesNumber ? <p>HIES: {installer.accreditations.hiesNumber}</p> : null}
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-2xl font-black">Services and capacity</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <p className="flex items-center gap-2"><MapPin className="text-fern" size={18} /> {coveredTerritories.map((item) => item.name).join(", ")}</p>
                <p className="flex items-center gap-2"><Timer className="text-fern" size={18} /> {installer.surveyTurnaroundDays} day survey turnaround</p>
                <p className="flex items-center gap-2"><Wrench className="text-fern" size={18} /> {installer.monthlyInstallCapacity} installs per month</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {installer.services.map((service) => <span key={service} className="chip">{service}</span>)}
              </div>
              <p className="mt-5 text-ink/70">Warranty: {installer.warranty}</p>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-2xl font-black">Areas covered</h2>
              <p className="mt-3 leading-7 text-ink/70">{installer.areasCovered.join(", ")}</p>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-2xl font-black">Reviews</h2>
              <div className="mt-4 grid gap-4">
                {installerReviews.length > 0 ? installerReviews.map((review) => (
                  <blockquote key={review.customerName} className="border-l-4 border-solar pl-4">
                    <p className="font-bold">{review.rating}/5 from {review.customerName}</p>
                    <p className="mt-1 text-ink/70">{review.reviewText}</p>
                  </blockquote>
                )) : <p className="text-ink/65">Reviews are awaiting approval.</p>}
              </div>
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm preferredInstallerId={installer.id} compact />
          </aside>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: installer.companyName,
          areaServed: coveredTerritories.map((territory) => territory.name),
          url: `${siteUrl()}/installers/${installer.slug}`,
          aggregateRating: { "@type": "AggregateRating", ratingValue: installer.rating, reviewCount: Math.max(installerReviews.length, 1) }
        })}
      />
    </main>
  );
}
