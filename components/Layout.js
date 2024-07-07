import Nav from "@/components/Nav";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";
import LoginForm from "./LoginForm";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  if (!session) {
    return (
      <div className={"bg-gray-500 w-screen h-screen flex items-center"}>
        <div className="text-center w-full mb-[25px]">
          <div className="flex justify-center gap-2 mb-3">
            <img
              src="71754eddd12d40f325f3f70dad377afc-removebg-preview (1).png"
              alt="404"
              className="w-[80px] h-[80px]"
            />
            <h1 className="font-bold text-[50px] mt-[35px]">ADMIN</h1>
          </div>
          <button
            onClick={() => signIn("google")}
            className="bg-gray-300 p-2 px-4 rounded-lg text-black text-[20px]"
          >
            Login with Google
          </button>

          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="bgGray"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">
          <div className="flex flex-row-reverse bg-gray-300 text-black rounded-lg overflow-hidden">
            <img src={session?.user?.image} alt="" className="w-6 h-6" />
            <span className="px-2">{session?.user?.name}</span>
          </div>
          <div className="border-4 p-2 rounded-xl w-[79%] ml-auto mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
