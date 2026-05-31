"use client";

import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductForm({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm(`確定要刪除「${name}」嗎？刪除後前台也會同步移除。`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="min-h-11 border border-red-300 px-5 py-2 text-sm text-red-700 transition hover:bg-red-50">
        刪除
      </button>
    </form>
  );
}
