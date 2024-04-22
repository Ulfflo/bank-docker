"use client"

import { useState, useEffect } from "react";

export default function Konto() {
  const [balance, setBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");

  

  const fetchInitialBalance = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        console.error("Session ID not found in localStorage");
        return;
      }
      const response = await fetch("http://localhost:3001/me/accounts/balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        console.error("Failed to fetch initial balance");
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    } 
  };

  useEffect(() => {
    fetchInitialBalance();
  }, []);

  const depositMoney = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const response = await fetch(
        "http://localhost:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
          body: JSON.stringify({ amount: depositAmount }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(data.newBalance);
      } else {
        console.error("Failed to deposit money");
      }
    } catch (error) {
      console.error("Något gick fel.", error);
    } finally {
      setDepositAmount("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text 4xl">Ditt konto</h1>
      <div className="flex flex-col bg-yellow-50 border border-solid justify-content items-center w-[600px] h-96 rounded">
        <p className="mt-12">
          <span className="font-semibold">Saldo:</span> {balance} kronor
        </p>
        <div className="mt-20">
          <p className="font-semibold text-2xl">Insättning</p>
        </div>
        <div className="flex items-center mt-6">
          <label htmlFor="depositAmount" className="mr-2 mt-1">
            Belopp:
          </label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
            className="mt-2 border border-gray-300 rounded p-1 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="ml-2 mt-1">kronor</span>
        </div>
        <div className="flex justify-center">
          <button onClick={depositMoney} className="bg-white text-black border border-yellow-50 rounded-full px-5 py-2 cursor-pointer mt-8">Sätt in</button>
        </div>
      </div>
    </div>
  );
}