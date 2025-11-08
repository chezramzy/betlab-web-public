'use client'

import { useOptimistic } from 'react'

/**
 * Hook pour gérer optimistic updates sur une liste de favoris
 * @param initialFavorites - Liste initiale des IDs favoris
 * @returns État optimiste et fonction pour ajouter/retirer un favori
 */
export function useOptimisticFavorite(initialFavorites: string[]) {
  const [optimisticFavorites, addOptimisticFavorite] = useOptimistic(
    initialFavorites,
    (state, newFavorite: string) => {
      if (state.includes(newFavorite)) {
        return state.filter(id => id !== newFavorite)
      }
      return [...state, newFavorite]
    }
  )

  return { optimisticFavorites, addOptimisticFavorite }
}

/**
 * Hook pour gérer optimistic updates sur une liste d'éléments
 * @param initialItems - Liste initiale des éléments
 * @returns État optimiste et fonctions CRUD
 */
export function useOptimisticList<T extends { id: string }>(initialItems: T[]) {
  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    initialItems,
    (state, action: { type: 'add' | 'update' | 'delete'; item: T | string }) => {
      switch (action.type) {
        case 'add':
          return [...state, action.item as T]
        case 'update':
          return state.map(item =>
            item.id === (action.item as T).id ? (action.item as T) : item
          )
        case 'delete':
          return state.filter(item => item.id !== action.item)
        default:
          return state
      }
    }
  )

  const addItem = (item: T) => {
    updateOptimisticItems({ type: 'add', item })
  }

  const updateItem = (item: T) => {
    updateOptimisticItems({ type: 'update', item })
  }

  const deleteItem = (id: string) => {
    updateOptimisticItems({ type: 'delete', item: id })
  }

  return {
    optimisticItems,
    addItem,
    updateItem,
    deleteItem,
  }
}
