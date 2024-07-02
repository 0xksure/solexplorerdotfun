import { Connection, VersionedTransaction } from "@solana/web3.js";
import type { WalletStore } from "@svelte-on-solana/wallet-adapter-core";


export interface SignTransactionResult {
    signature?: string,
    latestBlockhash?: {
        blockhash: string,
        feeCalculator: {
            lamportsPerSignature: number,
        }
    },
    error?: string
}

export async function SignAndSendTransaction(
    payer: WalletStore,
    vtx: VersionedTransaction,

): Promise<SignTransactionResult> {
    if (!payer.signTransaction) {
        return { error: "no wallet connected" };
    }
    const signedVtx = await payer.signTransaction(vtx);
    if (!signedVtx) {
        return { error: "error signing link transaction" };
    }

    // encode the signed transaction
    const versionedTransactionBuffer = Buffer.from(signedVtx.serialize());

    /// make request to /transaction
    const response = await fetch("/transaction", {
        method: "POST",
        body: JSON.stringify({ versionedTransactionBuffer }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return await response.json();
} 