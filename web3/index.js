
let btn = document.querySelector('.btn'),
    btn_top = document.querySelector('.btn-top'),
    html_console = document.querySelector('#console');

let balance = document.querySelector('.balance'),
    account = document.querySelector('.account'),
    import_button = document.querySelector('.import');

btn.addEventListener('mousedown', () => {
    btn_top.style.transform = "translateY(20%)";
});

btn.addEventListener('mouseup', () => {
    btn_top.style.transform = "translateY(0%)";
});

if (typeof window.ethereum != 'undefined') {

    console.log('Ethereum instance exists.');

    startApp(window.ethereum);

} else {
    button_prompt_install();
}

// APP

function startApp(ethereum) {

    let user_account = null;

    if (ethereum.isMetaMask) {
        console.log('Provider is MetaMask.');

        ethereum.on('chainChanged', eth_handle_chain_changed);
        ethereum.on('accountsChanged', eth_handle_accounts_changed);
        
        import_button_enable();

        app_check_connection();

    } else {
        console.log('Provider is not MetaMask.');
        prompt_install();
    }

    async function express_get_balance(account) {
        let res = null;
        const url = 'http://node.trapecar.com/balance';
        const data = {
            to_address: account,
        };
        const params = {
            headers: { "content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(data),
            method: "POST",
            mode: "cors"
        };
        let wait = await fetch(url, params)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    button_prompt_reload();
                    throw new Error("Could not reach the API: " + response.statusText);
                }
            }).then(function (data) {
                res = data.balance;
            }).catch(function (error) {
                button_prompt_reload();
                console.log(error.message);
            });

        return res;
    }

    function eth_handle_chain_changed() {
        console.log('Reload ...');
        window.location.reload();
    }

    function eth_handle_accounts_changed() {
        console.log('Reload ...');
        window.location.reload();
    }

    function app_check_connection() {
        ethereum.request({ method: 'eth_accounts' }).then(app_handle_accounts).catch(console.error);
    }

    async function app_handle_accounts(accounts) {
        if (accounts.length === 0) {
            button_prompt_connect();
        } else {
            console.log('Connected to MetaMask.');
            user_account = accounts[0];
            account.innerText = user_account;
            balance.innerText = 'BALANCE: ' + await express_get_balance(user_account);
            btn.removeEventListener('click', app_connect);

            if (btn.dataset.error === 'true') return 1;
            app_check_network();
        }
        console.log(accounts);
    }

    function app_check_network() {
        ethereum
        .request({ method: 'eth_chainId' })
        .then(result => app_handle_chain(result));
    }

    function app_handle_chain(chainId) {
        if (chainId == 0x13881) {
            console.log('Network is Mumbai.');
            button_hide_load();
            btn_top.innerText = 'GRAB A TOKEN';
            btn.addEventListener('click', app_grab_token);
        } else {
            console.log('Please switch to Mumbai network.');
            button_hide_load();
            btn_top.innerText = 'SWITCH NETWORK';
            btn.addEventListener('click', app_add_mumbai_testnet);
        }
    }

    async function app_add_mumbai_testnet() {
        try {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x13881', // Hexadecimal version of 80001, prefixed with 0x
                    chainName: "Mumbai",
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18,
                    },
                    rpcUrls: ["https://speedy-nodes-nyc.moralis.io/cebf590f4bcd4f12d78ee1d4/polygon/mumbai"],
                    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
                    iconUrls: [""],
                }],
            });
        } catch (addError) {
            console.log('Did not add network ' + addError);
            button_prompt_reload();
        }
    }

    function app_import_token() {
        console.log('Importing token to MetaMask ...');
        
        import_button_diasble();

        window.open('http://gal.trapecar.com/web3/import');

        setTimeout(() => {
            import_button_enable();
        }, 3000);

        // setTimeout(() => {
        //     button_hide_load();
        //     app_prompt_grab_token();
        // }, 5000);

    }

    function app_prompt_grab_token() {
        btn_top.innerText = 'GRAB A TOKEN';
        btn.addEventListener('click', app_grab_token);
    }

    function app_grab_token() {
        console.log('Grabbing token ...');
        btn.removeEventListener('click', app_grab_token);

        button_show_load();

        const url = 'http://node.trapecar.com/grab';
        const data = {
            to_address: user_account,
        };
        const params = {
            headers: { "content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(data),
            method: "POST",
            mode: "cors"
        };

        let timeout = setTimeout(() => {
            app_console_prompt('NOTE: Mumbai might be experiencing high congestion or your transaction is waiting to be picked up by the indexer. Please wait patiently, this could take 5 minutes or more.');
        }, 15000);

        fetch(url, params)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    clearTimeout(timeout);
                    button_prompt_reload();
                    throw new Error("Could not reach the API: " + response.statusText);
                }
            }).then(function (data) {
                clearTimeout(timeout);
                button_hide_load();
                if (data.result_object.result == 0) app_prompt_machine('hash', data.result_object.hash);
                if (data.result_object.result == 2) app_prompt_machine('nohash', data.result_object.hash);
                if (data.result_object.result == 1) button_prompt_reload();
            }).catch(function (error) {
                console.log(error.message);
                clearTimeout(timeout);
                button_prompt_reload();
            });
    }

    function app_prompt_machine(mode, hash) {

        if (mode == 'hash') {
            btn_top.innerText = ':)';
            html_console.innerText = 'NOTE: Transaction is pending ... You can check it\'s progress on ';
            let link = document.createElement('a');
            link.innerText = 'mumbai.polygonscan.com';
            link.target = '_blank';
            link.href = 'https://mumbai.polygonscan.com/tx/' + hash;
            html_console.appendChild(link);
            btn.addEventListener('click', () => {});
        }

        if (mode == 'nohash') {
            btn_top.innerText = ':)';
            btn.addEventListener('click', () => {});
        }
    }

    function app_console_prompt(string) {
        html_console.innerText = string;
    }

    function button_prompt_connect() {
        button_hide_load()
        btn_top.innerText = 'Connect to MetaMask';
        btn.addEventListener('click', app_connect);
    }

    function app_connect() {
        ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(app_handle_accounts)
            .catch((err) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                    button_prompt_reload();
                } else {
                    console.error(err);
                    button_prompt_reload();
                }
            });
    }

    function import_button_enable() {
        import_button.addEventListener('click', app_import_token);
        import_button.classList.remove('disable');
    }
    
    function import_button_diasble() {
        import_button.removeEventListener('click', app_import_token);
        import_button.classList.add('disable');
    }

}

//  HELPERS

function button_prompt_reload() {
    button_hide_load();
    btn.dataset.error = true;
    btn_top.classList.add('smalltext');
    btn_top.innerText = 'SOMETHING\'S WRONG ... PLEASE RELOAD';
    btn.addEventListener('click', app_reload);
}

function app_reload() {
    window.location.reload();
}

function button_clear_prompt() {
    btn_top.innerText = '';
}

function button_show_load() {
    button_clear_prompt();
    let loader = document.querySelector('.loader');
    loader.classList.remove('hide');
}

function button_hide_load() {
    button_clear_prompt();
    let loader = document.querySelector('.loader');
    loader.classList.add('hide');
}

function button_prompt_install() {
    btn_top.innerText = 'Install MetaMask';
    btn.addEventListener('click', () => {
        window.open('https://metamask.io/download/', '_blank').focus();
    });
}