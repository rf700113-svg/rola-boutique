"use client";

import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductForm({ id, name, disabled = false }: { id: string; name: string; disabled?: boolean }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm("確定要刪除此商品嗎？")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        disabled={disabled}
        aria-label={`刪除 ${name}`}
        className="min-h-9 w-full border border-red-300 px-3 py-1.5 text-xs text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        刪除
      </button>
    </form>
  );
}
