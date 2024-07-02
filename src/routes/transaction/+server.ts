import { Connection, VersionedTransaction } from '@solana/web3.js';
import { error } from '@sveltejs/kit';

// Get the solver account for the given address
export const POST = (async (event) => {

    try {
        const rpcUrl = process.env.RPC_URL
        if (!rpcUrl) throw error(400, 'No rpc url found')
        const requestBody = await event.request.json()
        const signedVtxBuffer = requestBody.versionedTransactionBuffer;
        if (!signedVtxBuffer) throw error(400, 'No signed vtx found')
        const signedVtx = VersionedTransaction.deserialize(Buffer.from(signedVtxBuffer));
        const connection = new Connection(rpcUrl, "confirmed");

        const signature = await connection.sendTransaction(signedVtx);
        const latestBlockhash = await connection.getLatestBlockhash();
        console.log(`[transaction]. Awaiting confirmation. signature: ${signature}, latestBlockhash: ${JSON.stringify(latestBlockhash)}`);
        const signatureResult = await connection.confirmTransaction({ signature, ...latestBlockhash });
        console.log(`[transaction] Transaction confirmed.`, signatureResult);
        return new Response(
            JSON.stringify({ signature, latestBlockhash }),
            {
                status: 200,
            },
        );
    }
    catch (e) {
        console.log(`[transaction] Transaction failed unexpectedly.`, e);
        return new Response(
            JSON.stringify({ error: e, }),
            {
                status: 200,
            },
        );
    }



}); 