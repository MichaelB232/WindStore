import Navbar from "@/src/components/layout/navbar/Navbar";
import Footer from "@/src/components/layout/Footer";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
