import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { Keypair } from '@solana/web3.js';
import {
  findMetadataPda,
  updateMetadataAccount,
} from '@metaplex-foundation/mpl-token-metadata';

(async () => {
  try {
    // RPC Endpoint for the Solana cluster (use mainnet-beta or devnet)
    const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

    // Replace this with your mint address
    const MINT_ADDRESS = '<YOUR_SPL_TOKEN_MINT_ADDRESS>';

    // Replace this with the private key of your wallet (update authority)
    const WALLET_SECRET_KEY = Uint8Array.from([
      /* Replace this array with your wallet's secret key */
    ]);

    // Metadata JSON URI (host this JSON file online)
    const METADATA_URI = 'https://example.com/my-token-metadata.json';

    // Set up Umi with the mplTokenMetadata plugin
    const umi = createUmi(RPC_ENDPOINT).use(mplTokenMetadata());

    // Load your wallet as the update authority
    const wallet = Keypair.fromSecretKey(WALLET_SECRET_KEY);
    umi.useWallet(wallet);

    // Find the Metadata PDA for the token mint
    const metadataPda = findMetadataPda(umi, MINT_ADDRESS);

    // Update metadata for the token
    console.log('Updating metadata...');
    const tx = await updateMetadataAccount(umi, {
      metadata: metadataPda,
      updateAuthority: umi.wallet.publicKey,
      name: 'Goon Too Soon', // Name of your token
      symbol: 'GTS', // Token symbol
      uri: METADATA_URI, // Metadata JSON URI
    }).sendAndConfirm(umi);

    console.log('Metadata updated successfully!');
    console.log(`Transaction ID: ${tx.signature}`);
  } catch (error) {
    console.error('Failed to update metadata:', error);
  }
})();
