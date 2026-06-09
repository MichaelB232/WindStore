export default function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-360 px-8">
      {children}
    </div>
  );
}