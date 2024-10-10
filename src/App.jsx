/** @format */

import reactLogo from "./assets/react.svg";
import "./App.css";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useEnsName,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useBalance } from "wagmi";
import Web3 from "web3";
import { CORE_ABI, NFT_CONTRACT } from "./contract/coreABI";

function App() {
  const { open } = useWeb3Modal();
  var web3 = new Web3(Web3.givenProvider || "http://localhost:5173/");

  const { address, isConnected, chain } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const fromWei = (value, unit = "ether") => {
    return web3.utils.fromWei(value.toString(), unit);
  };
  const result = useBalance({
    address: address,
    chainId: chain?.id,
    unit: "ether",
  });

  function truncate(str, n) {
    return str.length > n ? str.slice(0, 4) + "..." + str.slice(-4) : str;
  }

  const handleStake = async () => {
    writeContract({
      address: NFT_CONTRACT,
      abi: CORE_ABI,
      functionName: "claimNFT",
      args: [],
    });
  };
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <>
      <div>
        <a>
          <img
            src='https://github.com/web3modal.png'
            className='logo'
            alt='Vite logo'
          />
        </a>
        <a>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Web3 Modal + React</h1>
      {isConnected ? (
        <button onClick={() => handleStake()} disabled={isPending}>
          {" "}
          {isPending ? "Confirming..." : "Claim NFT"}{" "}
        </button>
      ) : (
        <button onClick={() => open()}>Connect</button>
      )}

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {error.shortMessage}</div>}

      {isConnected && (
        <div className='card'>
          <p>
            Address:{" "}
            <code>
              {truncate(`${ensName ? `${ensName} (${address})` : address}`, 8)}
            </code>
          </p>
          <p className='read-the-docs'>
            Balance:{" "}
            {parseInt(result?.data?.value) > 0
              ? Math.round(fromWei(result?.data?.value) * 100) / 100
              : 0}
          </p>
        </div>
      )}
    </>
  );
}

export default App;
