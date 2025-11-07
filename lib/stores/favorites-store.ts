"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesState {
  favoriteIds: string[] // Match IDs
  addFavorite: (matchId: string) => void
  removeFavorite: (matchId: string) => void
  toggleFavorite: (matchId: string) => void
  isFavorite: (matchId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (matchId) => {
        set((state) => ({
          favoriteIds: [...new Set([...state.favoriteIds, matchId])],
        }))
      },

      removeFavorite: (matchId) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== matchId),
        }))
      },

      toggleFavorite: (matchId) => {
        const { isFavorite, addFavorite, removeFavorite } = get()
        if (isFavorite(matchId)) {
          removeFavorite(matchId)
        } else {
          addFavorite(matchId)
        }
      },

      isFavorite: (matchId) => {
        return get().favoriteIds.includes(matchId)
      },

      clearFavorites: () => {
        set({ favoriteIds: [] })
      },
    }),
    {
      name: "favorites-storage",
    }
  )
)
