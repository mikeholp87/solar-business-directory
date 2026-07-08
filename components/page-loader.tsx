export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-semibold text-muted">Loading...</p>
      </div>
    </div>
  );
}
