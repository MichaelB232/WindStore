import Container from "@/src/components/layout/Container";
import ProfileSidebar from "@/src/components/profile/ProfileSidebar";

export const metadata = {
  title: "Profile — WindStore",
  description:
    "Browse gaming, professional, AI-powered, and creator laptops from the world's leading Windows brands.",
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="py-20 sm:py-24 w-full">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <aside className="col-span-1 lg:col-span-3">
            <ProfileSidebar />
          </aside>
          <main className="col-span-1 lg:col-span-9 min-h-103">{children}</main>
        </div>
      </Container>
    </div>
  );
}
