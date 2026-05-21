type CourseProgressBarProps = {
  totalDays: number;
  completedCount: number;
};

export function CourseProgressBar({
  totalDays,
  completedCount,
}: CourseProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-label={`${completedCount} of ${totalDays} days complete`}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const filled = i < completedCount;
          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-700 ease-in-out ${
                filled
                  ? "sacred-glow bg-amber-500/70"
                  : "bg-stone-800/80"
              }`}
            />
          );
        })}
      </div>
      <p className="text-xs tracking-widest text-stone-500 uppercase">
        {completedCount} of {totalDays} complete
      </p>
    </div>
  );
}
