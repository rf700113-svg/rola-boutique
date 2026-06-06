import { Facebook, MessageCircle } from "lucide-react";
import { facebookUrl as fallbackFacebookUrl, lineUrl as fallbackLineUrl } from "@/lib/contact";
import type { SocialSettings } from "@/lib/settings";

export function ContactButtons({ compact = false, social }: { compact?: boolean; social?: SocialSettings }) {
  const lineUrl = social?.lineUrl || fallbackLineUrl;
  const facebookUrl = social?.facebookUrl || fallbackFacebookUrl;
  const showLine = social?.showLineButton ?? true;
  const showFacebook = social?.showFacebookButton ?? true;

  return (
    <div className={compact ? "flex flex-wrap gap-3" : "grid gap-3 sm:flex"}>
      {showLine ? (
        <a
          href={lineUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#06C755] px-6 py-3 text-sm tracking-[0.16em] text-white transition hover:opacity-90"
        >
          <MessageCircle size={18} />
          LINE 一對一詢問
        </a>
      ) : null}
      {showFacebook ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-[#1877F2] bg-[#1877F2] px-6 py-3 text-sm tracking-[0.16em] text-white transition hover:opacity-90"
        >
          <Facebook size={18} />
          Facebook 私訊詢問
        </a>
      ) : null}
    </div>
  );
}
