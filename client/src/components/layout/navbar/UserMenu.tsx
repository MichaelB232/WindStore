"use client";

import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";

type UserProps = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type UserMenuProps = {
  isHomePage: boolean;
  scrolled: boolean;
};

export default function UserMenu({ isHomePage, scrolled }: UserMenuProps) {
  const isTransparent = isHomePage && !scrolled;
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();

      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push("/"); // redirect setelah logout
      router.refresh(); // optional: refresh auth state
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
          <DropdownMenuItem>Wishlist</DropdownMenuItem>
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
