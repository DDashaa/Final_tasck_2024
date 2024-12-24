"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  const [funds, setFunds] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const { address: connectedAddress } = useAccount();

  const { data: deployedContractData } = useDeployedContractInfo("YourContract");
  const { data: contractBalance } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getBalance",
  });

  const { writeContractAsync: withdrawFundsAsync } = useScaffoldWriteContract("YourContract");

  useEffect(() => {
    if (contractBalance) {
      console.log("Contract balance received:", contractBalance);
      setFunds(formatEther(contractBalance));
    } else {
      console.log("No balance data received.");
    }
  }, [contractBalance]);

  const withdrawFunds = async () => {
    try {
      setTransactionStatus("Processing...");
      await withdrawFundsAsync({ functionName: "withdraw" });
      setTransactionStatus("Withdrawal successful!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setTransactionStatus("Error during withdrawal.");
    }
  };

  return (
    <div className={styles.container}>
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Your Contract</span>
        </h1>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Contract Address:</p>
          <Address address={deployedContractData?.address} />
        </div>
      </div>

      <br />
      <div className="px-5">
        <h2 className="text-center">
          <span className="block text-2xl mb-2">Contract Balance: {funds} ETH</span>
        </h2>
      </div>

      <div className="px-5 mt-4">
        <button className={styles.button} onClick={withdrawFunds}>
          Withdraw Funds
        </button>
      </div>

      <br />
      <div className="px-5 mt-4">
        <p>{transactionStatus}</p>
      </div>
    </div>
  );
}
