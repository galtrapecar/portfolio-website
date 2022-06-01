if (typeof window.ethereum != 'undefined') {

    console.log('Ethereum instance exists.');

    startApp(window.ethereum);

} else {
    window.close();
}

function startApp(ethereum) {
    if (ethereum.isMetaMask) {
        app_prompt_import();
    } else {
        window.close();
    }

    function app_prompt_import() {
        console.log('Importing token to MetaMask ...');

        const tokenAddress = '0x32820d457c10cffcd2a08c1ca6e62a5fade5af9d';
        const testTokenAddress = '0xeb3d62e12e8615f5f10a698535664efc297cfa7c';
        const tokenSymbol = 'TKN';
        const tokenDecimals = 0;
        const tokenImage = 'http://placekitten.com/200/300';

        ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: testTokenAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                    image: tokenImage,
                },
            },
        });

        setTimeout(() => {
            window.close();
        }, 100);
    }
}