"use client";

import { useState } from "react";

export function ListingGallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) {
    return <p className="grid aspect-[16/10] place-items-center border border-line bg-mist text-base text-muted">Photos are not up yet.</p>;
  }

  const current = photos[index] ?? photos[0];

  return (
    <div>
      <img src={current} alt={`${title}, photo ${index + 1} of ${photos.length}`} className="aspect-[16/10] w-full bg-mist object-cover" />
      {photos.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((photo, photoIndex) => (
            <button
              key={photo}
              type="button"
              aria-current={photoIndex === index ? "true" : undefined}
              aria-label={`Show photo ${photoIndex + 1}`}
              onClick={() => setIndex(photoIndex)}
              className={`h-16 w-24 shrink-0 border ${photoIndex === index ? "border-navy" : "border-line"}`}
            >
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
