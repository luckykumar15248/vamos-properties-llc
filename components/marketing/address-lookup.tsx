"use client";

import { type FormEvent, useState } from "react";

export function AddressLookup() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  function go(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = address.trim();
    if (value.length < 5) {
      setError("Enter the street address so we know which house.");
      return;
    }
    setError("");
    sessionStorage.setItem("vamos-address", value);
    window.dispatchEvent(new CustomEvent("vamos-address", { detail: value }));
    document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => {
      document.getElementById("name")?.focus();
    }, 350);
  }

  return (
    <form onSubmit={go} className="mx-auto mt-8 w-full max-w-2xl text-left">
      <label htmlFor="hero-address" className="block text-sm text-white/90">
        Your address
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="hero-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          autoComplete="street-address"
          placeholder="1234 W Example Ave, Phoenix"
          className="min-h-14 w-full bg-white px-4 text-base text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          className="min-h-14 shrink-0 bg-amber px-7 text-base font-semibold text-amber-ink"
        >
          Get your cash offer
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-amber" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm text-white/70">No fee to ask. You can say no.</p>
      )}
    </form>
  );
}
