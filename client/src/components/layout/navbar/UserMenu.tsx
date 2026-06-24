import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

type UserMenuProps = {
  isHomePage: boolean;
  scrolled: boolean;
};

export default function UserMenu({ isHomePage, scrolled }: UserMenuProps) {
  const isTransparent = isHomePage && !scrolled;
  const isLogin = false;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User
          className={`transition-colors duration-300
                      ${
                        isTransparent
                          ? "text-white hover:text-accent"
                          : "text-text-primary hover:text-accent"
                      }
                    `}
        />
      </DropdownMenuTrigger>

      {!isLogin ? (
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <Link href={ROUTES.LOGIN}>
              <DropdownMenuItem>Sign in</DropdownMenuItem>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <DropdownMenuItem>Sign up</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            {/* (Icon/image) + Nama */}
            <DropdownMenuLabel>Photo Profile + Name</DropdownMenuLabel>
            <DropdownMenuLabel>User Email</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Wishlist</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
