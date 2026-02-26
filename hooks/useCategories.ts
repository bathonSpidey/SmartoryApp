// ─────────────────────────────────────────────
//  useCategories
//  Fetches, creates, updates, and deletes food
//  categories for the authenticated user.
// ─────────────────────────────────────────────

import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/lib/categories.service";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "./useSession";

export type UseCategoriesResult = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addCategory: (payload: CategoryCreatePayload) => Promise<void>;
  editCategory: (
    categoryId: string,
    payload: CategoryUpdatePayload,
  ) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
};

export function useCategories(): UseCategoriesResult {
  const { session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories(session.access_token);
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (payload: CategoryCreatePayload) => {
      if (!session?.access_token) return;
      await createCategory(session.access_token, payload);
      await load();
    },
    [session?.access_token, load],
  );

  const edit = useCallback(
    async (categoryId: string, payload: CategoryUpdatePayload) => {
      if (!session?.access_token) return;
      await updateCategory(session.access_token, categoryId, payload);
      await load();
    },
    [session?.access_token, load],
  );

  const remove = useCallback(
    async (categoryId: string) => {
      if (!session?.access_token) return;
      await deleteCategory(session.access_token, categoryId);
      await load();
    },
    [session?.access_token, load],
  );

  return {
    categories,
    loading,
    error,
    refetch: load,
    addCategory: add,
    editCategory: edit,
    removeCategory: remove,
  };
}
