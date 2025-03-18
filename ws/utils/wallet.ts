import { Connection, Cluster, Keypair, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
// import * as path from "path";

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// let connection: Connection

// const walletPath = path.join(__dirname, "wallet.json");
let walletPath: string// = path.join(".", "wallet.json");
// 从文件加载钱包
export function loadWallet(env: Cluster, walletPath: string): Keypair {
    // connection = new Connection(clusterApiUrl(env), "confirmed");
    if (!fs.existsSync(walletPath)) {
        throw new Error("Wallet file not found. Please create a wallet first.");
    }

    // 读取钱包文件
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));

    // 将数组转换回 Uint8Array
    const secretKey = Uint8Array.from(walletData.secretKey);

    // 生成 Keypair
    return Keypair.fromSecretKey(secretKey);
}

const pk = loadWallet("devnet", "../wallet2.json").publicKey.toString();
console.log('public key:', pk);