import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { SuiClient } from "@mysten/sui/client";

const suiClient = new SuiClient({
  url: "https://fullnode.testnet.sui.io:443"
});

export const getSigner = ({ secretKey }: { secretKey: string }) => {
  // Handle both Bech32 format (suiprivkey...) and base64 format
  if (secretKey.startsWith("suiprivkey")) {
    // Use decodeSuiPrivateKey for Bech32 format
    return Ed25519Keypair.fromSecretKey(secretKey);
  } else {
    // Handle base64 format (legacy)
    const privKeyArray = Uint8Array.from(Array.from(fromBase64(secretKey)));
    return Ed25519Keypair.fromSecretKey(Uint8Array.from(privKeyArray).slice(1));
  }
};

export const mintNFT = async (
  packageId: string, 
  suiAddress: string, 
  sbtNumber: number,
  numberTableId: string,
  addressTableId: string
) => {

  
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::nft::claim`,
    arguments: [
      tx.pure.string("Sui Run Club Badge"), // name
      tx.pure.string("A unique badge for Sui Run Club members"), // description
      tx.pure.string("https://suirun.s3.eu-north-1.amazonaws.com/nft1.png"), // image_url
      tx.object(numberTableId), // number_table
      tx.object(addressTableId), // address_table
      tx.pure.u64(sbtNumber), // runner_number
      tx.pure.address(suiAddress), // to
    ],
  });
  
  console.log('Transaction created, executing...');
  
  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: process.env.USER_SECRET_KEY! }),
  });
  
  console.log('Transaction result:', result);
  return result;
};
