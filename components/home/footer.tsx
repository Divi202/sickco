export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
        © {year} SickCo. All rights reserved.
      </div>
    </footer>
  );
}

export default SiteFooter;
