import {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import { loadWallet } from "./utils/wallet";
import { getConfigValue } from "./utils/config";
// import { mainModule } from "process";

const WSS_ENDPOINT = getConfigValue("../config.yaml", 'dev.quicknote.wss');
const HTTP_ENDPOINT = getConfigValue("../config.yaml", 'dev.quicknote.http');
const connection = new Connection(HTTP_ENDPOINT, { wsEndpoint: WSS_ENDPOINT });
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 将指定数量的 Lamports（SOL 的最小单位）从一个钱包转移到另一个钱包。
 * 
 * @param from - 发送方的钱包密钥对，包含公钥和私钥。
 * @param to - 接收方的公钥，表示目标钱包地址。
 * @param amount - 要转移的 Lamports 数量。
 * @returns 无返回值，但会在控制台输出模拟交易结果和交易签名。
 */
async function transferLamports(from: Keypair, to: PublicKey, amount: number) {
    // 从 from 钱包发送 SOL 到 to 钱包
    const instruction = SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount,
    });
    const transaction = new Transaction().add(instruction);

    const simulateResult = await connection.simulateTransaction(transaction, [from]);
    console.log(`模拟交易结果: ${JSON.stringify(simulateResult)}\n`);

    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log(`交易签名: ${signature}`);
}

async function getBalance(pubKey: PublicKey) {
    // 获取账户余额
    const balance = await connection.getBalance(pubKey);
    const sol = balance / LAMPORTS_PER_SOL;
    console.log(`账户 ${pubKey} 余额: ${sol} SOL`);
    // return balance
}

async function main() {
    // const ACCOUNT_TO_WATCH = new PublicKey('vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg');
    const ACCOUNT_TO_WATCH = loadWallet('devnet', '../wallet.json').publicKey;
    const from = loadWallet('devnet', "../wallet2.json");
    const subscriptionId = await connection.onAccountChange(
        ACCOUNT_TO_WATCH,
        (updatedAccountInfo) =>
            console.log(`---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL'),
        "confirmed"
    );
    console.log('Starting web socket, subscription ID: ', subscriptionId);
    await sleep(10000); //Wait 10 seconds for Socket Testing
    // await connection.requestAirdrop(ACCOUNT_TO_WATCH, LAMPORTS_PER_SOL);
    transferLamports(from, ACCOUNT_TO_WATCH, 100000);
    await sleep(10000); //Wait 10 for Socket Testing
    await connection.removeAccountChangeListener(subscriptionId);
    console.log(`Websocket ID: ${subscriptionId} closed.`);

    getBalance(from.publicKey);
}

main();