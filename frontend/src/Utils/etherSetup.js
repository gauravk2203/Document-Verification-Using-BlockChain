import { ethers } from "ethers";

export const getProviderAndSigner = async () => {
    if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install it to continue.");
    }

    // Request accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Set up provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return { provider, signer };
};
