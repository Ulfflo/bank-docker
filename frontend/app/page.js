import arbetare from "../public/arbetare.jpg"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
     <div className="flex flex-col-reverse md:flex-row justify-between pl-8 pt-8">
      <div className="w-full md:w-2/5 mb-8 md:mb-0 md:mr-12">
        <h2 className="text-4xl">Nu pratar vi pengar med landets arbetare</h2>
        <p className="leading-relaxed mb-16 "> Att bli arbetare är att ta ett stort steg, kanske det största steget man tar i livet. Man går från att bara slöa och slappa till att använda musklerna och hugga i, och får ta ansvar för sin egen ekonomi. Det kan såklart upplevas på olika sätt: frihet, oro, lättnad. Men här kan vi hjälpa till - genom att guida och dela med oss av våra tips och erfarenheter. Därför bjuder vi nu in alla landets arbetare för att prata pengar</p>
        <Link
        href="/blikund" className="bg-black text-yellow-50 rounded-full px-5 py-2 ml-36 no-underline">Bli kund

        </Link>
      </div>
      <div className="w-full md:w-3/5">
        <div className="relative h-64 md:h-[400px]">
          <Image src={arbetare} alt="Arbetare" layout="fill" objectFit="cover"/>
        </div>
      </div>
     </div>
    </main>
  );
}
