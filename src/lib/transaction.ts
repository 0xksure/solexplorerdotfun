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
    const versionedTransactionBuffer = signedVtx.serialize().toString();

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

export function DeserializeTransaction(serializedTx: string): VersionedTransaction {
    let data: Uint8Array;

    // Check if the string is base64 encoded
    if (/^[A-Za-z0-9+/]*={0,2}$/.test(serializedTx)) {
        // It's base64, so decode it
        data = Uint8Array.from(atob(serializedTx), c => c.charCodeAt(0));
    } else {
        // It's not base64, assume it's a comma-separated list of numbers
        data = Uint8Array.from(serializedTx.split(',').map(Number));
    }

    return VersionedTransaction.deserialize(data);
}