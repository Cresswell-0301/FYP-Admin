import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <span className="text-black font-black text-4xl">Direct Admin</span>
    </Layout>
  );
}
