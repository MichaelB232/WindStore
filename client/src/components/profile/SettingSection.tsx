"use client";

import { UserRound, SaveCheck } from "lucide-react";
import { getInitials, getAvatarHue } from "@/src/lib/producttype/ReviewType";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import UpdateValidators from "@/src/services/user/user.validator";
import { updateProfile } from "@/src/services/user/user.service";
import { toast } from "sonner";
import DeleteAccountSection from "./DeleteAccountSection";
import AddressSection from "@/src/components/address/AddressSection";

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
      <div className="mb-6 sm:mb-8">
        <h1 className="font-bold font-display text-2xl sm:text-3xl">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your account preferences, and security.
        </p>
      </div>

      <div className="form shadow-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white mb-8">
        <div className="header flex gap-3 mb-6 items-center">
          <UserRound size={22} className="text-accent" />
          <p className="text-xl sm:text-2xl font-bold font-display">
            Personal Information
          </p>
        </div>
        <div className="form-content">
          <form action="" className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start">
              <div className="flex flex-col items-center gap-3 shrink-0">
                {/* Image still using hue and cannot be change for now */}
                <div
                  className="flex size-24 sm:size-30 shrink-0 items-center justify-center rounded-full text-xl sm:text-2xl font-bold"
                  style={{
                    background: `hsl(${hue},60%,88%)`,
                    color: `hsl(${hue},50%,35%)`,
                  }}
                >
                  {getInitials(user!.username)}
                </div>
                {/* not working yet */}
                <p className="text-xs sm:text-sm text-accent">Change Photo</p>
              </div>
              <div className="w-full">
                <div className="flex flex-col gap-1 mb-4 sm:mb-5">
                  <label
                    htmlFor="username"
                    className="text-xs sm:text-sm font-medium text-gray-700 font-display"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-accent"
                  />
                  {errors.username && (
                    <div className="mt-1">
                      <p className="text-xs text-danger">{errors.username}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-xs sm:text-sm font-medium text-gray-700 font-display"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-accent"
                  />
                  {errors.email && (
                    <div className="mt-1">
                      <p className="text-xs text-danger">{errors.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-accent text-white font-medium font-display rounded-xl transition duration-200 ease-in-out hover:bg-accent-hover cursor-pointer text-sm sm:text-base shadow-sm"
              >
                <SaveCheck size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mb-8">
        <AddressSection />
      </div>

      <DeleteAccountSection user={user!} />
    </section>
  );
}
