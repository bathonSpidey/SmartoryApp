// ─────────────────────────────────────────────
//  Smartory — Categories Service
//  CRUD operations for food categories.
//  Default categories (is_default: true) are shared
//  across all users and cannot be modified or deleted.
// ─────────────────────────────────────────────

const BASE_URL = "http://127.0.0.1:8000";

// ─── Types ────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  shelf_days: number;
  user_id: string | null;
  created_at: string;
  is_default: boolean;
};

export type CategoryCreatePayload = {
  name: string;
  shelf_days: number;
};

export type CategoryUpdatePayload = {
  name?: string;
  shelf_days?: number;
};

// ─── API calls ────────────────────────────────

/**
 * GET /categories
 * Returns all categories (default + user-created) for the authenticated user.
 */
export async function fetchCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to load categories (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * POST /categories
 * Creates a new user-owned category.
 */
export async function createCategory(
  token: string,
  payload: CategoryCreatePayload,
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to create category (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * PUT /categories/{category_id}
 * Updates an existing user-owned category.
 */
export async function updateCategory(
  token: string,
  categoryId: string,
  payload: CategoryUpdatePayload,
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update category (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * DELETE /categories/{category_id}
 * Deletes a user-owned category.
 */
export async function deleteCategory(
  token: string,
  categoryId: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to delete category (${res.status}): ${text}`);
  }
}
