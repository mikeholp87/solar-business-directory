import { PageLoader } from "@/components/page-loader";

export default function Loading() {
  return (
    <main className="section-band">
      <div className="container-page">
        <PageLoader />
      </div>
    </main>
  );
}
