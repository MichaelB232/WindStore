import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/shadcn/dialog";
import { Button } from "../ui/shadcn/button";
import { deleteUser } from "@/src/services/user/user.service";
import { User } from "@/src/services/auth/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/routes/routes";
import { useAuth } from "@/src/services/auth/AuthContext";

interface DeleteAccountSectionProps {
  user: User;
}

export default function DeleteAccountSection({
  user,
}: DeleteAccountSectionProps) {
  const router = useRouter();
  const {logout} = useAuth();

  const handelDelete = async () => {
    const result = await deleteUser(user.id);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    await logout();
    setTimeout(async () => {
      router.push(ROUTES.HOME);
      router.refresh();
    }, 1500);
  };
  return (
    <div className="p-8 bg-danger/10 rounded-xl shadow-card border border-danger/30">
      <p className="text-danger font-display font-medium text-2xl">
        Danger Zone
      </p>
      <p className="text-md font-display text-gray-600">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <Dialog>
        <DialogTrigger
          title="this delete action is permanent"
          className="border border-danger p-3 text-danger rounded-2xl mt-5 transition ease-in-out duration-200 hover:bg-danger hover:text-white"
        >
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-40 bg-danger text-white"
              onClick={handelDelete}
            >
              Confirm
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="w-40">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
