const pause = (value) => {return new Promise(resolve => {setTimeout(resolve, value)})};

const logo = document.querySelector('.oe');

let logo_interval = setInterval(() => {
    if (logo.dataset.state == 'off') {
        logo_turn_on();
    } else {
        logo_turn_off();
    }
}, 10000);

async function logo_flicker(times) {
    for (let i = 0; i <= times; i++) {
        logo.style.opacity = .4;
        await pause(100);
        logo.style.opacity = 1;
        await pause(100);
    }
    return;
}

async function logo_turn_on() {
    logo.dataset.state = 'on';
    await logo_flicker(1);
    logo.style.opacity = 1;
}

async function logo_turn_off() {
    logo.dataset.state = 'off';
    await logo_flicker(2);
    logo.style.opacity = .4;
}
