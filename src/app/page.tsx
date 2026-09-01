import Image from "next/image";
import LogoMarca from "@/assets/Logomarca.png";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F6F5F2] px-6 py-16 font-sans text-[#141414] animate-in fade-in duration-[400ms]">
      <main className="flex w-full max-w-xl flex-col items-center text-center">
        <Image
          src={LogoMarca}
          alt="Harone Magalhães"
          className="h-11 w-auto"
          priority
        />

        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Harone Magalhães
        </h1>
        <p className="mt-2 text-base text-[#6B6B6B]">
          Estúdio de tecnologia e presença digital
        </p>

        <div className="mt-12 space-y-1">
          <p className="text-lg font-semibold">Site em atualização.</p>
          <p className="text-[#6B6B6B]">
            Estou preparando uma versão nova. Volto já.
          </p>
        </div>

        <p className="mt-10 text-sm text-[#6B6B6B]">
          Precisa de algo agora? Fala comigo no{" "}
          <a
            href="https://wa.me/5579981164388"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#141414] underline underline-offset-4 hover:opacity-70"
          >
            WhatsApp
          </a>{" "}
          ou no{" "}
          <a
            href="https://www.instagram.com/haronedev_"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#141414] underline underline-offset-4 hover:opacity-70"
          >
            Instagram
          </a>
          .
        </p>
      </main>

      <footer className="mt-20 text-xs text-[#6B6B6B]">
        © {year} Harone Magalhães · Aracaju, Brasil
      </footer>
    </div>
  );
}
