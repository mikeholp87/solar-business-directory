import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listReviewsForAdmin, updateReviewAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Reviews", "Approve and moderate public reviews.", "/admin/reviews");

async function saveReviewAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const reviewId = String(formData.get("id") ?? "");
  await updateReviewAdmin(reviewId, formData.get("approved") === "on");
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const reviews = await listReviewsForAdmin();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Reviews</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">Approve customer reviews before they appear on installer profiles.</p>
      </div>

      {reviews.map((review) => (
        <form key={review.id ?? `${review.installerId}-${review.customerName}`} action={saveReviewAction} className="surface-card grid gap-4 p-5">
          <input type="hidden" name="id" value={review.id ?? ""} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{review.customerName}</h3>
              <p className="mt-1 text-sm text-ink/65">{review.rating}/5 · {review.installerId}</p>
            </div>
            <span className={review.approved ? "chip chip-success" : "chip chip-soft"}>{review.approved ? "Approved" : "Pending"}</span>
          </div>
          <p className="leading-7 text-ink/70">{review.reviewText}</p>
          <label className="flex items-start gap-2">
            <input name="approved" type="checkbox" defaultChecked={review.approved ?? false} className="size-4 w-auto" />
            <span>Approved for public display</span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">Save review</button>
          </div>
        </form>
      ))}
    </section>
  );
}
