import { MessageCircle } from "lucide-react";

export function FloatingLineButton({ lineUrl }: { lineUrl: string }) {
  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="LINE 一對一詢問"
      className="floating-line-button fixed bottom-6 right-5 z-[9000] inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#06C755] text-white shadow-soft transition hover:scale-105 hover:bg-[#05B54D] sm:h-14 sm:w-14"
    >
      <MessageCircle size={22} className="sm:h-6 sm:w-6" />
    </a>
  );
}
