type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  return (
    <form action="/auth/signout" method="post" className={className}>
      <button
        type="submit"
        className="rounded-full border border-stone-700/80 bg-stone-900/40 px-8 py-2.5 text-sm tracking-widest text-stone-400 uppercase transition-all duration-700 ease-in-out hover:border-stone-600 hover:text-stone-200"
      >
        Sign out
      </button>
    </form>
  );
}
