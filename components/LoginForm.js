import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      setError("");
      console.log("Login success:", result);
    } else {
      setError("Invalid email or password");
      console.error("Login error:", result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 ml-auto mr-auto w-[300px]">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 rounded border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="p-2 mt-2 rounded border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        required
      />
      <br />
      <button
        type="submit"
        className="mt-2 bg-gray-300 p-2 px-4 rounded-lg text-black text-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
      >
        Login
      </button>
    </form>
  );
}
