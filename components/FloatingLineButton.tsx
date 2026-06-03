import { MessageCircle } from "lucide-react";
import { lineUrl } from "@/lib/contact";

export function FloatingLineButton() {
  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="LINE 詢問"
      className="floating-line-button fixed bottom-6 right-5 z-[9000] inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#06C755]/[0.92] text-white shadow-soft transition hover:scale-105 sm:h-14 sm:w-14 sm:bg-[#06C755]"
    >
      <MessageCircle size={22} className="sm:h-6 sm:w-6" />
    </a>
  );
}
