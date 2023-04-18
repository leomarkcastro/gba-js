import pb from "@/lib/pocketbase";

const authMeFx = async () => {
  await pb.collection("users").authRefresh();

  return pb.authStore.model;
};

export default authMeFx;
