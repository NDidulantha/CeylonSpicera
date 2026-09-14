export function Stars({ r }: { r: number }) {
    return (
        <span className="font-sans text-[11px] tracking-[0.08em] text-gold">
      {"★★★★★".slice(0, Math.round(r))}
            <span className="text-[#D8C8AE]">{"★★★★★".slice(Math.round(r))}</span>
    </span>
    );
}

export function Heart({ filled, beat }: { filled: boolean; beat: boolean }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={filled ? "#8A5B33" : "none"}
            stroke={filled ? "#8A5B33" : "#5C3724"}
            strokeWidth={1.6}
            style={beat ? { animation: "csBeat .42s ease" } : undefined}
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export function Bag({ size = 18, stroke = 1.5 }: { size?: number; stroke?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
    );
}

/* Global keyframes for overlays + heart, mounted once */
export function ShopKeyframes() {
    return (
        <style>{`
      @keyframes csQvIn { from { opacity:0; transform: translateY(14px) scale(.965) } to { opacity:1; transform:none } }
      @keyframes csSlideIn { from { transform: translateX(100%) } to { transform:none } }
      @keyframes csBeat { 0%{transform:scale(1)} 40%{transform:scale(1.34)} 70%{transform:scale(.92)} 100%{transform:scale(1)} }
      @keyframes csFade { from { opacity:0 } to { opacity:1 } }
    `}</style>
    );
}