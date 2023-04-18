import pb from "@/lib/pocketbase";
import GBALoader from "@/components/GBALoader";
import { useEffect, useRef } from "react";

export async function getStaticPaths() {
  const records = await pb
    .collection("games")
    .getFullList(200 /* batch size */, {
      sort: "-created",
    });

  const paths = records.map((record) => ({
    params: { id: record.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { id } }) {
  const record = await pb.collection("games").getOne(id);

  return {
    props: {
      record: JSON.stringify(record),
    },
    revalidate: 30,
  };
}

export default function Page({ record }) {
  return (
    <div className="mt-20">
      <GBALoader record={record} />
    </div>
  );
}
