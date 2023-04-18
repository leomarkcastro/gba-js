import pb from "@/lib/pocketbase";

const getMyTokenFX = () => {
  return pb.authStore.token;
};

export default getMyTokenFX;
