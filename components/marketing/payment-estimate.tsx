"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/listings/money";

export function PaymentEstimate({ price, monthlyPayment }: { price: number | null; monthlyPayment: number | null }) {
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const estimate = useMemo(() => {
    if (price == null) return null;
    const downPercent = Number(down);
    const annual = Number(rate);
    const term = Number(years);
    if (!Number.isFinite(downPercent) || !Number.isFinite(annual) || !Number.isFinite(term) || term <= 0) return null;
    const principal = price * (1 - downPercent / 100);
    if (principal <= 0) return 0;
    const monthlyRate = annual / 100 / 12;
    const payments = term * 12;
    if (monthlyRate === 0) return Math.round(principal / payments);
    const payment = (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -payments);
    return Math.round(payment);
  }, [down, price, rate, years]);

  return (
    <section className="border border-line bg-panel p-5">
      <h2 className="text-xl font-semibold text-ink">A rough monthly number</h2>
      <p className="mt-2 text-sm leading-6 text-muted">This is arithmetic, not a loan offer. Taxes, insurance, and the real rate will change it.</p>
      {monthlyPayment != null ? (
        <p className="mt-4 text-base leading-7 text-ink">
          The payment recorded for this house is {formatMoney(monthlyPayment)} a month. Confirm the loan before you count on that.
        </p>
      ) : null}
      {price != null ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <NumberField label="Down payment %" name="down" value={down} onChange={setDown} />
          <NumberField label="Rate %" name="rate" value={rate} onChange={setRate} />
          <NumberField label="Years" name="years" value={years} onChange={setYears} />
          <p className="sm:col-span-3 text-2xl font-semibold text-ink">{estimate != null ? `${formatMoney(estimate)} / month` : "Enter the numbers above."}</p>
        </div>
      ) : (
        <p className="mt-4 text-base text-ink">Call for the price before estimating a payment.</p>
      )}
    </section>
  );
}

function NumberField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm text-ink">
      {label}
      <input
        name={name}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      />
    </label>
  );
}
