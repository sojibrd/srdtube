"use client";

/**
 * Where the operator puts their own YouTube API key.
 *
 * Empty is a valid state: the app falls back to a built-in key. That key is
 * shared by everyone who opens the site, so its daily quota runs out fast —
 * hence the note under the field.
 */
export default function ApiKeyField({
  value,
  onChange,
  usingFallback,
}: {
  value: string;
  onChange: (value: string) => void;
  usingFallback: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="t-label" htmlFor="api-key">
        YouTube API Key
      </label>
      <input
        id="api-key"
        type="password"
        className="input"
        autoComplete="off"
        spellCheck={false}
        placeholder="Leave empty to use the shared key"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="t-caption">
        {usingFallback
          ? "Using the shared key — its daily quota is shared by every visitor."
          : "Stored in this browser only."}
      </p>
    </div>
  );
}
