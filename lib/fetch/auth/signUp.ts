import pb from "@/lib/pocketbase";

const randomHash = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const signUpFx = async (email: string, password: string, metadata: any) => {
  const data = {
    username: metadata.username || email.split("@")[0],
    email: email,
    emailVisibility: true,
    password: password,
    passwordConfirm: password,
    name: metadata.name || email.split("@")[0],
  };

  console.log(data);
  await pb.collection("users").create(data);
};

export default signUpFx;
