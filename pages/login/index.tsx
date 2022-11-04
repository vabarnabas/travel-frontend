import Head from "next/head";
import { useRouter } from "next/router";
import { SyntheticEvent, useState } from "react";
import { fetchData } from "../../services/request";
import TokenService from "../../services/token-service";

export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tokenservice = new TokenService();
  const router = useRouter();

  const onFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    const data = await fetchData("POST", {
      baseUrl: "https://api.travel.barnabee.studio",
      path: "auth/local/signin",
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
    const token = data?.access_token;

    if (token) {
      await tokenservice.saveToken(token);
      router.push("/");
    } else {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="text-slate-900">
      <Head>
        <title>Travel App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen select-none flex-col items-center justify-center px-6">
        <form onSubmit={(e) => onFormSubmit(e)} className="w-72 space-y-4">
          <p className="text-3xl font-semibold">Login</p>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            type="text"
            placeholder="Username or e-mail"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none"
          />
          <div className="">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full rounded-md border px-3 py-2 text-sm text-black outline-none"
            />
            {error ? (
              <p className="mt-2 text-xs text-slate-500">{error}</p>
            ) : null}
          </div>
          <button className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
