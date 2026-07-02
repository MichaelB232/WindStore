"use client";

import { UserRound, SaveCheck } from "lucide-react";
import { getInitials, getAvatarHue } from "@/src/lib/producttype/ReviewType";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import UpdateValidators from "@/src/services/user/user.validator";
import { updateProfile } from "@/src/services/user/user.service";
import { toast } from "sonner";
import DeleteAccountSection from "./DeleteAccountSection";

export default function SettingSection() {
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState(user!.username);
  const [email, setEmail] = useState(user!.email);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = UpdateValidators(username, email);
    setErrors(validationErrors);
    if (validationErrors.username || validationErrors.email) return;

    const update = await updateProfile({ username, email });
    if (!update.success) {
      setErrors((prev) => ({
        ...prev,
        general: update.message,
      }));
      toast.error(update.message);
      return;
    }

    toast.success(update.message);
    await refreshUser();
  };

  const hue = getAvatarHue(user!.username);
  return (
    <section id="setting">
      <div className="mb-8">
        <h1 className="font-bold font-display text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences, and security.
        </p>
      </div>

      <div className="form shadow-card p-5 rounded-xl mb-8">
        <div className="header flex gap-3 mb-6">
          <UserRound size={25} className="text-accent" />
          <p className="text-2xl font-bold font-display">
            Personal Information
          </p>
        </div>
        <div className="form-content">
          <form action="" className="w-full" onSubmit={handleSubmit}>
            <div className="flex gap-10 items-center">
              <div className="flex flex-col items-center gap-3">
                {/* Image still using hue and cannot be change for now */}
                <div
                  className="flex size-30 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
                  style={{
                    background: `hsl(${hue},60%,88%)`,
                    color: `hsl(${hue},50%,35%)`,
                  }}
                >
                  {getInitials(user!.username)}
                </div>
                {/* not working yet */}
                <p className="text-sm text-accent">Change Photo</p>
              </div>
              <div className="w-full">
                <div className="flex flex-col gap-1 mb-5">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 font-display"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                  {errors.username && (
                    <div className="mb-5">
                      <p className="text-danger">{errors.username}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 font-display"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                  {errors.email && (
                    <div className="mb-5">
                      <p className="text-danger">{errors.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-15 flex justify-end">
              <button
                type="submit"
                className="flex gap-3 p-5 bg-accent text-white font-medium font-display rounded-xl transition duration-200 ease-in-out hover:bg-accent-hover "
              >
                <SaveCheck />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <DeleteAccountSection user={user!}/>

    </section>
  );
}
