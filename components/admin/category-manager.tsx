"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, deleteTag, saveCategory } from "@/lib/admin/blog-actions";
import type { CategoryView, TagView } from "@/lib/dal/blog";

const fieldClass = "mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink";

export function CategoryManager({ categories, tags }: { categories: CategoryView[]; tags: TagView[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [message, setMessage] = useState("");

  async function createCategory() {
    const result = await saveCategory({
      id: null,
      name,
      description,
      parentId: parentId ? Number(parentId) : null,
    });
    setMessage(result.message);
    if (result.ok) {
      setName("");
      setDescription("");
      setParentId("");
      router.refresh();
    }
  }

  return (
    <div className="mt-8 grid gap-8">
      {message ? <p className="border border-line bg-panel px-4 py-3 text-base text-ink">{message}</p> : null}
      <form
        className="grid gap-4 border border-line bg-panel p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void createCategory();
        }}
      >
        <h2 className="text-lg font-semibold text-ink">New category</h2>
        <label className="text-sm text-ink">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required className={fieldClass} />
        </label>
        <label className="text-sm text-ink">
          Parent
          <select value={parentId} onChange={(event) => setParentId(event.target.value)} className={fieldClass}>
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink">
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={fieldClass} />
        </label>
        <button type="submit" className="inline-flex min-h-12 w-fit items-center bg-amber px-4 text-base font-semibold text-amber-ink">
          Add category
        </button>
      </form>

      <ul className="grid gap-3">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} categories={categories} onMessage={setMessage} />
        ))}
      </ul>

      <section>
        <h2 className="text-lg font-semibold text-ink">Tags</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Tags are created when you save a post. Removing one takes it off every post that used it.</p>
        {tags.length === 0 ? <p className="mt-4 text-base text-ink">No tags yet.</p> : null}
        <ul className="mt-4 grid gap-2">
          {tags.map((tag) => (
            <li key={tag.id} className="flex items-center justify-between gap-3 border border-line bg-panel px-4 py-3">
              <span className="text-base text-ink">{tag.name}</span>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`Remove the tag ${tag.name}?`)) return;
                  void deleteTag(tag.id).then((result) => {
                    setMessage(result.message);
                    if (result.ok) router.refresh();
                  });
                }}
                className="inline-flex min-h-11 items-center px-3 text-sm text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CategoryRow({
  category,
  categories,
  onMessage,
}: {
  category: CategoryView;
  categories: CategoryView[];
  onMessage: (message: string) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [parentId, setParentId] = useState(category.parentId ? String(category.parentId) : "");

  return (
    <li className="border border-line bg-panel p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-ink">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
        </label>
        <label className="text-sm text-ink">
          Parent
          <select value={parentId} onChange={(event) => setParentId(event.target.value)} className={fieldClass}>
            <option value="">None</option>
            {categories
              .filter((item) => item.id !== category.id)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </label>
      </div>
      <label className="mt-3 block text-sm text-ink">
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className={fieldClass} />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            void saveCategory({
              id: category.id,
              name,
              description,
              parentId: parentId ? Number(parentId) : null,
            }).then((result) => {
              onMessage(result.message);
              if (result.ok) router.refresh();
            });
          }}
          className="inline-flex min-h-11 items-center bg-navy px-3 text-sm font-semibold text-white"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm(`Remove ${category.name}?`)) return;
            void deleteCategory(category.id).then((result) => {
              onMessage(result.message);
              if (result.ok) router.refresh();
            });
          }}
          className="inline-flex min-h-11 items-center px-3 text-sm text-ink"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
