import { json } from '@sveltejs/kit';
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';


// USDC token mint address on Solana mainnet
const USDC_MINT = new web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const DESTINATION_WALLET = new web3.PublicKey("CNY467c6XURCPjiXiKRLCvxdRf3bpunagYTJpr685gPv");
export async function POST({ request }) {
    const RPC_URL = 'https://api.mainnet-beta.solana.com';
    try {
        const { fromAddress } = await request.json();
        if (!fromAddress) {
            return json({ error: 'From address is required' }, { status: 400 });
        }

        const connection = new web3.Connection(RPC_URL, 'confirmed');
        const fromPubkey = new web3.PublicKey(fromAddress);
        const toPubkey = new web3.PublicKey(DESTINATION_WALLET);

        const fromTokenAccount = await splToken.getAssociatedTokenAddress(
            USDC_MINT,
            fromPubkey
        );

        const toTokenAccount = await splToken.getAssociatedTokenAddress(
            USDC_MINT,
            toPubkey
        );

        const transferInstruction = splToken.createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromPubkey,
            500000 // 1 USDC (USDC has 6 decimal places)
        );

        const latestBlockhash = await connection.getLatestBlockhash();

        const messageV0 = new web3.TransactionMessage({
            payerKey: fromPubkey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [transferInstruction]
        }).compileToV0Message();

        const transaction = new web3.VersionedTransaction(messageV0);
        const serializedTx = transaction.serialize().toString();
        return json({
            transaction: serializedTx,
            latestBlockhash: latestBlockhash.blockhash
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}