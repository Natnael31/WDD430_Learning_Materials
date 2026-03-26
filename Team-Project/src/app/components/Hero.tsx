
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 px-6 py-16 sm:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            artisan-first marketplace
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover unique handcrafted treasures
          </h1>
          <p className="mt-5 text-lg text-slate-700 sm:text-xl">
            Support local craftspeople, shop ethically, and find one-of-a-kind pieces.
            A friendly community where makers and conscious buyers connect.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="#"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-500/20 transition hover:-translate-y-0.5 sm:w-auto"
            >
              Explore creations
            </Link>
            <Link href="#"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
            >
              Start selling
            </Link>
          </div>

        </div>

        <figure className="mt-10 lg:mt-0">
          <Image
            src="/hero-artisan.webp"
            alt="Artisan crafting home decor item"
            width={800}
            height={600}
            className="mx-auto block h-72 w-full max-w-md rounded-3xl object-cover shadow-xl ring-1 ring-slate-200 sm:h-96"
            priority
          />
          <figcaption className="mt-3 text-center text-xs text-slate-500">
            Every piece tells a story of craftsmanship and community
          </figcaption>
        </figure>
      </div>
    </section>
  );
}