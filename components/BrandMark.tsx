interface BrandMarkProps {
  accent: string;
}

export default function BrandMark({ accent }: BrandMarkProps) {
  return (
    <div
      className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm"
      style={{ backgroundColor: accent, color: "#fff" }}
    >
      ◈
    </div>
  );
}
