import Navbar from "@/src/components/layout/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      
      {children}
    </>
  );
}
