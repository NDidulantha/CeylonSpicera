/*
  Update WHATSAPP_NUMBER with the real business line before launch — this
  placeholder won't open a real chat. Digits only, country code, no "+".
*/
const WHATSAPP_NUMBER = "94770000000";
const WHATSAPP_MESSAGE = "Hello Ceylon Spicera, I'd like to know more about your spices.";

export default function WhatsAppButton() {
    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_14px_32px_-10px_rgba(0,0,0,.45)] transition-transform duration-300 hover:scale-105"
            style={{ background: "#25D366" }}
        >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                <path d="M17.5 14.4c-.3-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.14-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5-.17-.01-.37-.01-.56-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.57-.35z" />
                <path d="M12.04 2C6.58 2 2.13 6.42 2.13 11.86c0 1.86.5 3.6 1.38 5.1L2 22l5.2-1.47a9.9 9.9 0 0 0 4.84 1.23h.01c5.46 0 9.9-4.42 9.9-9.86C21.96 6.42 17.5 2 12.04 2zm0 18.06h-.01c-1.6 0-3.16-.43-4.52-1.24l-.32-.19-3.09.87.83-3.01-.21-.31a8.16 8.16 0 0 1-1.26-4.32c0-4.52 3.7-8.2 8.26-8.2 2.2 0 4.28.86 5.83 2.42a8.1 8.1 0 0 1 2.42 5.79c0 4.52-3.7 8.19-8.26 8.19h.01z" />
            </svg>
        </a>
    );
}
