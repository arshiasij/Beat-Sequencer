import RowContainer from "@/components/tilebox/rowcontainer";
import Image from "next/image";
import SoundPlayer from "@/components/sound/soundplayer";

export default function Home() {
  return (
    <main className="bg-[#202329] h-full py-10 px-16">
      <section className="">
          <h1 className="text-6xl font-bold capitalize text-center">
              A simple beat sequencer            
          </h1>

        <RowContainer tileCount={16} />
      </section>
    </main>
  );
}
