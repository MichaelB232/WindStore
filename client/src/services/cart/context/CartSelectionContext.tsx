"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";

interface CartSelectionContextType {
  selectedIds: Set<number>;
  isSelected: (cartItemId: number) => boolean;
  toggle: (cartItemId: number) => void;
  selectMany: (cartItemIds: number[]) => void;
  deselectMany: (cartItemIds: number[]) => void;
  clearSelection: () => void;
}

const CartSelectionContext = createContext<CartSelectionContextType | null>(
  null,
);

export function CartSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Reset selection on logout / account switch so the next user doesn't
  // inherit a stale checkout selection. Derived during render (not an
  // Effect) by tracking which user the current selection belongs to.
  const [selectionOwner, setSelectionOwner] = useState<number | null>(null);
  if (selectionOwner !== (user?.id ?? null)) {
    setSelectionOwner(user?.id ?? null);
    if (selectedIds.size > 0) setSelectedIds(new Set());
  }

  const isSelected = (cartItemId: number) => selectedIds.has(cartItemId);

  const toggle = (cartItemId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(cartItemId) ? next.delete(cartItemId) : next.add(cartItemId);
      return next;
    });
  };

  const selectMany = (cartItemIds: number[]) => {
    if (cartItemIds.length === 0) return;
    setSelectedIds((prev) => {
      const idsToAdd = cartItemIds.filter((id) => !prev.has(id));
      if (idsToAdd.length === 0) return prev;
      const next = new Set(prev);
      idsToAdd.forEach((id) => next.add(id));
      return next;
    });
  };

  const deselectMany = (cartItemIds: number[]) => {
    if (cartItemIds.length === 0) return;
    setSelectedIds((prev) => {
      const idsToRemove = cartItemIds.filter((id) => prev.has(id));
      if (idsToRemove.length === 0) return prev;
      const next = new Set(prev);
      cartItemIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <CartSelectionContext
      value={{
        selectedIds,
        isSelected,
        toggle,
        selectMany,
        deselectMany,
        clearSelection,
      }}
    >
      {children}
    </CartSelectionContext>
  );
}

export function useCartSelection() {
  const ctx = useContext(CartSelectionContext);
  if (!ctx) {
    throw new Error(
      "useCartSelection must be used inside CartSelectionProvider",
    );
  }
  return ctx;
}
