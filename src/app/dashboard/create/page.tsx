"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MascotColor, MascotStyle, MASCOT_STYLES } from "@/types/mascot";
import { clsx } from "clsx";

const DEFAULT_COLORS: MascotColor[] = [
  { name: "Primary", hex: "#22a846" },
  { name: "Secondary", hex: "#111111" },
  { name: "Accent", hex: "#ffffff" },
];

export default function CreateMascotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [species, setSpecies] = useState("");
  const [personality, setPersonality] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<MascotStyle>("3d-pixar");
  const [colors, setColors] = useState<MascotColor[]>(DEFAULT_COLORS);

  function updateColor(index: number, field: "name" | "hex", value: string) {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    setColors(updated);
  }

  function addColor() {
    if (colors.length < 5) {
      setColors([...colors, { name: `Color ${colors.length + 1}`, hex: "#888888" }]);
    }
  }

  function removeColor(index: number) {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          species,
          personality,
          description,
          style,
          colors,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("Not enough credits. Purchase more to continue.");
        } else {
          setError(data.error || "Generation failed");
        }
        setLoading(false);
        return;
      }

      router.push(`/dashboard/mascot/${data.mascotId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Create Mascot</h1>
      <p className="text-sm text-muted mb-8">
        Fill in the details and we&apos;ll generate a complete character sheet.
      </p>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={clsx(
              "h-1 flex-1 rounded-full transition",
              s <= step ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Step 1: Character details */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Character Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-danger">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Panda"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Species / Form <span className="text-danger">*</span>
              </label>
              <input
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Panda bear, Robot, Fox"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Charging Hero, Brand Ambassador"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Personality
            </label>
            <input
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. Friendly, Helpful, Energetic"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Any additional details about your mascot's appearance, costume, accessories..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!name || !species}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            Next: Choose Style
          </button>
        </div>
      )}

      {/* Step 2: Style */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Visual Style</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MASCOT_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={clsx(
                  "rounded-xl border-2 p-4 text-center transition",
                  style === s.value
                    ? "border-accent bg-accent-light"
                    : "border-border bg-card hover:border-accent/40"
                )}
              >
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-[11px] text-muted mt-1 leading-tight">
                  {s.description}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition hover:bg-card"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Next: Colors
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Colors + Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Brand Colors</h2>
            <div className="space-y-3">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(i, "hex", e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <input
                    value={color.name}
                    onChange={(e) => updateColor(i, "name", e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
                    placeholder="Color name"
                  />
                  <code className="text-xs text-muted w-16">{color.hex}</code>
                  {colors.length > 1 && (
                    <button
                      onClick={() => removeColor(i)}
                      className="text-xs text-muted hover:text-danger transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            {colors.length < 5 && (
              <button
                onClick={addColor}
                className="mt-2 text-xs text-accent hover:underline"
              >
                + Add color
              </button>
            )}
          </div>

          {/* Review summary */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Review</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted">Name</dt>
              <dd className="font-medium">{name}</dd>
              <dt className="text-muted">Species</dt>
              <dd className="font-medium">{species}</dd>
              {role && (
                <>
                  <dt className="text-muted">Role</dt>
                  <dd className="font-medium">{role}</dd>
                </>
              )}
              <dt className="text-muted">Style</dt>
              <dd className="font-medium">
                {MASCOT_STYLES.find((s) => s.value === style)?.label}
              </dd>
              <dt className="text-muted">Colors</dt>
              <dd className="flex gap-1.5">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="h-5 w-5 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </dd>
            </dl>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition hover:bg-card"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-accent px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Character Sheet (1 credit)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
