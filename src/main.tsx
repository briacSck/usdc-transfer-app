import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
    http,
    type Address,
    type Hash,
    createPublicClient,
    custom,
    stringify,
    encodeFunctionData,
    createWalletClient,
    TransactionReceipt,
} from 'viem';
import { sepolia } from 'viem/chains';
import 'viem/window';

// this is the poublic client; so here we choose the chain etc
const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
});

// this is the user wallet client
const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
});

// now we're connected to sepolia testnet, we can hcoose a smart contract to connect to USDC
const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

// now we define the ABI (application binary interface)
// it defines the way for viem to decode and encode smart contract function calls
const USDC_ABI = [
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' }, // address on which to send the funds
            { name: '_value', type: 'uint256' }, // ie the number of usdc to send
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
];

// now we can create a function called connect to ask the user to connec their metamask wallet
// request address prompts the client to connect their wallet
function Example() {
    const [account, setAccount] = useState<Address>();
    const [hash, setHash] = useState<Hash>();
    const [receipt, setReceipt] = useState<TransactionReceipt>();

    const addressInput = React.createRef<HTMLInputElement>();
    const valueInput = React.createRef<HTMLInputElement>();

    const connect = async () => {
        const [address] = await walletClient.requestAddresses();
        setAccount(address);
    };

    // now that we're connect we can define a function that sends USDC
    const sendTransaction = async () => {
        if (!account) return;
        const to = addressInput.current!.value as Address;
        const value = valueInput.current!.value as '${number}';
        const valueInWei = BigInt(value) * BigInt(10 ** 6);

        const data = encodeFunctionData({
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [to, valueInWei],
        });

        const hash = await walletClient.sendTransaction({
            account,
            to: USDC_CONTRACT_ADDRESS,
            data,
        });
        setHash(hash);

    };
    useEffect(() => {
        (async () => {
            if (hash) {
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                setReceipt(receipt);
            }
        })();
    }, [hash]);

    if (account) {
        return (
            <>
                <div>Connected: {account}</div>
                <input ref={addressInput} placeholder="address" />
                <input ref={valueInput} placeholder="value (USDC)" />
                <button onClick={sendTransaction}>Send</button>
                {receipt && (
                    <div>
                        Receipt: <pre><code>{stringify(receipt, null, 2)}</code></pre>
                    </div>
                )}
            </>
        )
    }
    return <button onClick={connect}>Connect Wallet</button>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Example />
);