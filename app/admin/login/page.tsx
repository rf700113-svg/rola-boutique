import { loginAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-4 py-16 text-charcoal">
      <div className="mx-auto max-w-md bg-ivory p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-champagne">ROLA Admin</p>
        <h1 className="mt-4 font-serif text-4xl text-charcoal">後台登入</h1>
        {params?.error === "1" ? (
          <p className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            帳號或密碼錯誤，請重新輸入。
          </p>
        ) : null}
        <form action={loginAction} className="mt-8 grid gap-4">
          <label className={labelClass}>
            帳號
            <input name="username" autoComplete="username" required className={inputClass} />
          </label>
          <label className={labelClass}>
            密碼
            <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
          </label>
          <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne">
            登入後台
          </button>
        </form>
      </div>
    </div>
  );
}
