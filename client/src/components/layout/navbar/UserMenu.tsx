import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";
import { ADMIN_ROUTES } from "@/src/routes/adminRoutes";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

type UserMenuProps = {
  isHomePage: boolean;
  scrolled: boolean;
};

export default function UserMenu({ isHomePage, scrolled }: UserMenuProps) {
  const isTransparent = isHomePage && !scrolled;
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const userIcon = (
    <User
      className={`size-5 sm:size-6 transition-colors duration-300 cursor-pointer
                      ${
                        isTransparent
                          ? "text-white hover:text-accent"
                          : "text-text-primary hover:text-accent"
                      }
                    `}
    />
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="w-6 h-6 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link href={ROUTES.LOGIN} aria-label="Login">
        {userIcon}
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{userIcon}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-semibold">{user.username}</DropdownMenuLabel>
          <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={ROUTES.PROFILE}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={ROUTES.WISHLIST}>
            <DropdownMenuItem>Wishlist</DropdownMenuItem>
          </Link>
          <Link href={ROUTES.ORDERS}>
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <Link href={ROUTES.SETTING}>
            <DropdownMenuItem>Setting</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={ADMIN_ROUTES.DASHBOARD}>
                <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
