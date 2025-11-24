"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProfileCount } from "@/app/actions/profile";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);

interface ProfileStore {
  profileCount: number | null;
  isLoading: boolean;
  fetchProfileCount: () => Promise<void>;
  incrementProfileCount: () => void;
  decrementProfileCount: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileCount: null,
  isLoading: false,
  fetchProfileCount: async () => {
    set({ isLoading: true });
    try {
      const count = await getProfileCount();
      set({ profileCount: count, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch profile count:", error);
      set({ profileCount: 0, isLoading: false });
    }
  },
  incrementProfileCount: () => {
    set((state) => ({
      profileCount: state.profileCount !== null ? state.profileCount + 1 : 1,
    }));
  },
  decrementProfileCount: () => {
    set((state) => ({
      profileCount: state.profileCount !== null && state.profileCount > 0 
        ? state.profileCount - 1 
        : 0,
    }));
  },
}));

