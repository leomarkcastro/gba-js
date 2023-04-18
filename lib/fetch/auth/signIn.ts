import pb from "@/lib/pocketbase";

const sigInFx = async (email: string, password: string) => {
  console.log(pb);
  await pb.collection("users").authWithPassword(email, password);
};

export default sigInFx;
