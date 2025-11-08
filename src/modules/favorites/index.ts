// Domain
export type { Favorite, FavoriteCreateInput, FavoriteActionResult } from "./domain/types";

// Server queries
export { getUserFavorites, isFixtureFavorited } from "./server/queries";

// Server actions
export {
  addFavoriteAction,
  removeFavoriteAction,
  toggleFavoriteAction,
} from "./server/actions";

// Components
export { FavoriteButton } from "./ui/components/favorite-button.client";
