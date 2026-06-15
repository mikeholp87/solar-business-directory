import { reviews as fallbackReviews } from "@/lib/data";
import { getSupabaseOrNull, mergeReviewRecord } from "@/lib/repositories/shared";
import type { Review } from "@/lib/types";

export async function listReviews(): Promise<Review[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return fallbackReviews.map((review) => ({ ...review, approved: true }));

  const { data } = await supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false });
  if (!data) return fallbackReviews.map((review) => ({ ...review, approved: true }));
  return data.map((row) => {
    const fallback = fallbackReviews.find((review) => review.installerId === row.installer_id) ?? fallbackReviews[0];
    return mergeReviewRecord(row, { ...fallback, approved: true });
  });
}

export async function listReviewsForInstaller(installerId: string) {
  const reviews = await listReviews();
  return reviews.filter((review) => review.installerId === installerId);
}
