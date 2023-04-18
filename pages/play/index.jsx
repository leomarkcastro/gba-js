import pb from "@/lib/pocketbase";
import Link from "next/link";

export default function Page({ records }) {
  const recordsParsed = JSON.parse(records);

  console.log(records);
  return (
    <div className="mt-16 bg-base-100 text-base-content">
      <div className="p-4 text-center">
        <h1 className="text-4xl font-bold">Play GBA Games Anywhere.</h1>
        <p className="text-xl">Save transfers from device to device!</p>
      </div>
      <div className="grid max-w-screen-lg grid-cols-3 gap-8 p-8 mx-auto">
        {recordsParsed.map((record) => (
          <Link
            href={`/play/${record.id}`}
            className="w-64 transition-transform shadow-xl cursor-pointer d-card d-card-compact bg-base-300 hover:scale-110"
            key={record.id}
          >
            <figure>
              <img
                className="object-cover w-full h-64"
                src={`https://gbacloud-server.app02.xyzapps.xyz/api/files/${record.collectionId}/${record.id}/${record.splash_image}`}
                alt="splash_image"
              />
            </figure>

            <div className="d-card-body">
              <h3 className="text-xl font-bold">{record.game_name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const records = await pb
    .collection("games")
    .getFullList(200 /* batch size */, {
      sort: "-created",
    });

  console.log(records);

  return {
    props: {
      records: JSON.stringify(records),
    },
    revalidate: 30,
  };
}
