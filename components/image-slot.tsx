import Image from "next/image";

/*
  Drop-in replacement for the design's <image-slot>.
  Convention: put photos at public/shop/{slotId}.jpg and pass src="/shop/{slotId}.jpg".
  With no src it renders a labelled sand placeholder, so the grid looks right before
  any photography exists.
*/
const pinstripe =
    "repeating-linear-gradient(45deg,rgba(138,79,36,.06) 0 12px,rgba(138,79,36,0) 12px 24px)";

export default function ImageSlot({
                                      src,
                                      alt,
                                      label,
                                      className = "",
                                  }: {
    src?: string;
    alt: string;
    label?: string;
    className?: string;
}) {
    return (
        <div
            className={`relative h-full w-full overflow-hidden ${className}`}
            style={{ backgroundColor: "#EFE8D8", backgroundImage: src ? undefined : pinstripe }}
        >
            {src ? (
                <Image src={src} alt={alt} fill sizes="400px" className="object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#8A7C68]">
                    {label ?? alt}
                </div>
            )}
        </div>
    );
}