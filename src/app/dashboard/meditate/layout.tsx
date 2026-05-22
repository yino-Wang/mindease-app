/** Full-bleed streaming detail — no dashboard header chrome */
export default function MeditateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0D0E0E] text-stone-300">
      {children}
    </div>
  );
}
