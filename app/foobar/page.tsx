"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const foo = ["abc"];
const pictures: string[] = [
  "https://utfs.io/f/ViWUst2KaHFKuSAOmTdo2p6sGYScZX1h4RlCU5dgf9kVtAji",
  "https://utfs.io/f/ViWUst2KaHFKBJtuOI9MG1BP0UvmQNbaVnXwp4Rdz5jIE2YS",
  "https://utfs.io/f/ViWUst2KaHFKqKs9GlYstZl9ORMipyu8AHG372XwSazUDncW",
];

interface Item {
  id: number;
  url: string;
}

const generatedP: Item[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  url: pictures[Math.floor(Math.random() * 3) + 1 - 1],
}));

export default function Page() {
  return (
    <div className="flex flex-wrap">
      {generatedP.map((p: Item) => (
        <div className="p-1" key={p.id}>
          <Card className="p-10">
            <Card className="p-10">
              <Image src={p.url} width={150} height={150} alt="picture"></Image>
            </Card>
          </Card>
        </div>
      ))}
    </div>
  );
}
