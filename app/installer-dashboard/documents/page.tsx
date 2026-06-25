import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { addInstallerDocument, getInstallerDashboardData } from "@/lib/repositories/installer-dashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Documents", "Upload and review compliance documents.", "/installer-dashboard/documents");

async function addDocumentAction(formData: FormData) {
  "use server";
  await requireRole(["installer", "admin"]);
  const installerId = String(formData.get("installer_id") ?? "");
  await addInstallerDocument(installerId, {
    documentType: String(formData.get("document_type") ?? ""),
    fileUrl: String(formData.get("file_url") ?? ""),
    verified: formData.get("verified") === "on"
  });
  revalidatePath("/installer-dashboard");
  revalidatePath("/installer-dashboard/documents");
}

export default async function InstallerDocumentsPage() {
  const { installer, documents } = await getInstallerDashboardData();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Documents</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Record accreditation files and compliance uploads. If storage is enabled later, this screen can swap the URL field for a file picker.</p>
      </div>

      <form action={addDocumentAction} className="surface-card grid gap-4 p-5">
        <input type="hidden" name="installer_id" value={installer.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label>Document type<input name="document_type" placeholder="MCS certificate" required /></label>
          <label>File URL<input name="file_url" placeholder="https://..." required /></label>
        </div>
        <label className="flex items-start gap-2">
          <input name="verified" type="checkbox" className="size-4 w-auto" />
          <span>Verified by admin</span>
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="button-primary" type="submit">Add document</button>
        </div>
      </form>

      {documents.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No documents uploaded yet.</p>
        </div>
      ) : (
        documents.map((document) => (
          <div key={document.id} className="surface-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">{document.documentType}</h3>
                <p className="mt-1 text-sm text-navy/65">{document.fileUrl}</p>
              </div>
              <span className={document.verified ? "chip chip-success" : "chip chip-soft"}>{document.verified ? "Verified" : "Pending"}</span>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
