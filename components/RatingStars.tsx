function Star({ filled }: { filled: boolean }) {
  return (
    <span style={{ color: filled ? "#d4a017" : "rgba(212,160,23,0.25)", fontSize: "0.85em" }}>★</span>
  );
}

export function RatingStars({ rating }: { rating: string }) {
  const value = parseFloat(rating);
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i + 1 <= Math.round(value)} />
      ))}
    </span>
  );
}
