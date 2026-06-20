import Navbar from "@/src/components/layout/navbar/Navbar";

export default function CartPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Navbar/>
      {children}
    </>
  );
}