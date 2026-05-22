export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black text-stone-300">{children}</div>
  );
}
