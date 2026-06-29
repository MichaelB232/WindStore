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
      className={`transition-colors duration-300
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
    return <Link href={ROUTES.LOGIN}>{userIcon}</Link>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{userIcon}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          {/* (Icon/image) + Nama */}
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <Link href={ROUTES.WISHLIST}>
            <DropdownMenuItem>Wishlist</DropdownMenuItem>
          </Link>
          <Link href={ROUTES.ORDERS}>
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
