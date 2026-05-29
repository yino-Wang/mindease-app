"use client";

export type ProfileTab = "history" | "details";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "history", label: "Watch History" },
  { id: "details", label: "Personal Details" },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <nav
      className="flex gap-8 border-b border-stone-800/50"
      role="tablist"
      aria-label="Profile sections"
    >
      {TABS.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`profile-panel-${tab.id}`}
            id={`profile-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`-mb-px border-b-2 pb-3 text-sm tracking-widest uppercase transition-colors duration-500 ${
              selected
                ? "border-amber-500/70 text-amber-300/90"
                : "border-transparent text-stone-500 hover:text-stone-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
