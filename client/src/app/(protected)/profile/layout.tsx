import Container from "@/src/components/layout/Container";
import ProfileSidebar from "@/src/components/profile/ProfileSidebar";

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
          <main className="col-span-9">{children}</main>
        </div>
      </Container>
    </div>
  );
}
