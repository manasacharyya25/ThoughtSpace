export function ColourfulAmbientGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="whisper-ambient-glow whisper-ambient-glow-blue absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw]" />
      <div className="whisper-ambient-glow whisper-ambient-glow-peach absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw]" />
      <div className="whisper-ambient-glow whisper-ambient-glow-lilac absolute left-1/2 top-1/4 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
