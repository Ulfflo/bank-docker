"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BliKund() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCreateAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok && password !== "" && username !== "") {
        alert("Grattis! Du har skapat ett konto i Arbetarbaken.");
        router.push("/loggain");
      } else {
        alert("Glöm inte att fylla i användarnamn och lösenord.");
      }
    } catch (error) {
      console.error("Något gick fel.", error);
    } finally {
      setPassword("");
      setUsername("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl text-center">
        Välkommen som kund i Arbetarbanken
      </h1>
      <div className="flex flex-col bg-black justify-content items-center w-96 h-96 text-yellow-50 rounded">
        <p className="mt-8">Skapa ett konto hos oss</p>
        <label htmlFor="username" className="mt-20">
          Användarnamn:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password" className="mt-8">
          Lösenord:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleCreateAccount}
          className="bg-white text-black rounded-full px-5 py-2 cursor-pointer mt-8"
        >
          Skapa konto
        </button>
      </div>
    </div>
  );
}
