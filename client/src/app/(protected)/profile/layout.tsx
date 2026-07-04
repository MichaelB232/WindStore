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
    <div className="py-24 w-full">
      <Container>
        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-3">
            <ProfileSidebar />
          </aside>
          <main className="col-span-9 min-h-103">{children}</main>
        </div>
      </Container>
    </div>
  );
}
