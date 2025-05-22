//Auth layout
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start p-8">
      <div className="w-full max-w-md mx-auto rounded-lg border border-white/10 bg-card/25 text-card-foreground shadow-sm backdrop-blur-xl p-8"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
