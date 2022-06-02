let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let elements = {
    burgers :           document.querySelectorAll('.burger'),
    hearts:             document.querySelector('.hearts'),
    contents:           document.querySelector('.menu'),
    exit:               document.querySelector('.exit'),
    menu:               document.querySelector('.menu-wrap'),
    insert:             document.querySelector('.insert'),
    var:                document.querySelector('#var'),
    clr:                document.querySelector('#clr2'),
    clr2:               document.querySelector('.clr2'),
    rot:                document.querySelector('#rot2'),
    rotx:               document.querySelector('#rotx'),
    roty:               document.querySelector('#roty'),
    cube:               document.querySelector('#cube'),
    cube_js:            document.querySelector('#cube_js'),
    posx:               document.querySelector('#posx'),
    posy:               document.querySelector('#posy'),
    tiles:              document.querySelectorAll('.tile'),
    wrapper:            document.querySelector('.wrapper'),
    background_text:    document.querySelector('#background-text')
}

let show_bgs = document.querySelectorAll('.show-bg');

let inserts = ['WEB DEVELOPER', 'PROGRAMMER', 'DESIGNER'];

let min = 33,
    max = 126;

setInterval(() => {
    elements.hearts.classList.add('blink');
    setTimeout(() => {
        elements.hearts.classList.remove('blink');
    }, 3000);
}, 9999);

// 0 -> forwards ;; 1 -> backwards
let cube_animation_dir = 0;

setInterval(() => {
    switch (elements.clr.innerHTML) {
        case `0`:
            if (cube_animation_dir == 0) {
                elements.clr.innerHTML = `1`;
                elements.clr2.innerHTML = `1`;
                break;
            } else if (cube_animation_dir == 1) {
                elements.clr.innerHTML = `1`;
                elements.clr2.innerHTML = `1`;
                cube_animation_dir = 0;
                break;
            }
            break;

        case `1`:
            if (cube_animation_dir == 0) {
                elements.clr.innerHTML = `2`;
                elements.clr2.innerHTML = `2`;
                break;
            } else if (cube_animation_dir == 1) {
                elements.clr.innerHTML = `0`;
                elements.clr2.innerHTML = `0`;
                break;
            }
            break;

        case `2`:
            if (cube_animation_dir == 0) {
                elements.clr.innerHTML = `3`;
                elements.clr2.innerHTML = `3`;
                break;
            } else if (cube_animation_dir == 1) {
                elements.clr.innerHTML = `1`;
                elements.clr2.innerHTML = `1`;
                break;
            }
            break;

        case `3`:
            if (cube_animation_dir == 0) {
                elements.clr.innerHTML = `2`;
                elements.clr2.innerHTML = `2`;
                cube_animation_dir = 1;
                break;
            } else if (cube_animation_dir == 1) {
                
            }
            break;
    
        default:
            elements.clr.innerHTML = `0`;
            elements.clr2.innerHTML = `0`;
            break;
    }
}, 500);

setInterval(() => {
    elements.rot.innerHTML = getCurrentRotation(elements.cube);
}, 50);

function getCurrentRotation(el){
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform")   ||
             st.getPropertyValue("-moz-transform")      ||
             st.getPropertyValue("-ms-transform")       ||
             st.getPropertyValue("-o-transform")        ||
             st.getPropertyValue("transform")           ||
             "none";
    if (tm != "none") {
      var values = tm.split('(')[1].split(')')[0].split(',');
      var angle = Math.round(Math.asin(values[0]) * (360/Math.PI));
      return angle;
    }
    return 0;
}

elements.contents.addEventListener('click', () => {
    if (!elements.menu.classList.contains('show')) {
        elements.menu.classList.add('show');
    }
}, false);

elements.exit.addEventListener('click', () => {
    if (elements.menu.classList.contains('show')) {
        elements.menu.classList.remove('show');
    }
}, false);

elements.tiles.forEach(tile => {

    let entered = false;

    tile.addEventListener('mouseenter', () => {
        entered = true;
        setTimeout(() => {
            if (entered) {
                tile.classList.add('pulse');
            }
        }, 500);
    });

    tile.addEventListener('mouseleave', () => {
        entered = false;
        tile.classList.remove('pulse');
    });
});

(() => {

    let top = window.innerHeight / 2;

    document.addEventListener('mousemove', event => {

        let position = getCoord(elements.cube_js);

        let x = position.left - event.clientX,
            y = position.top - event.clientY;

        x = (-x) / 3;
        y = y / 2;

        elements.cube_js.style.transform = `rotateX(${y / 3.6}deg) rotateY(${x / 3.6}deg)`;
        elements.rotx.innerHTML = `${Math.round(x / 3.6)}`;
        elements.roty.innerHTML = `${Math.round(y / 3.6)}`;

        elements.posx.innerHTML = `${Math.round(-x * 3)};`;
        elements.posy.innerHTML = `${Math.round(y * 2)};`;

    });

    // from: https://javascript.info/coordinates
    function getCoord(elem) {
        let box = elem.getBoundingClientRect();
        let bodyBox = document.body.getBoundingClientRect();

        // console.log(box.left + "  " + position.x);
        return {top: (box.top) + (elem.offsetHeight / 2), left: box.left + (elem.offsetWidth / 2)};      
    }

})();

let i;

async function animate_text() {

    elements.insert.innerHTML = ``;
        
    if (i < inserts.length) {

        await animate_char(inserts[i]);

        i++;
        await new Promise(r => setTimeout(r, 4000)); // Wait at the end

        for (let j = 0; j < inserts[i - 1].length; j++) {
            await clear();
        }
    } else {
        elements.insert.innerHTML = ``;
        i = 0;
    } 

    animate_text();
}

async function animate_char(insert) {
   for (let i = 0; i < insert.split('').length; i++) {
        await put_char(insert.split('')[i]);
   }

}

async function put_char(char) {
    elements.insert.innerHTML = `${elements.insert.innerHTML}${char}`;
    if (char != ' ') {
      await new Promise(r => setTimeout(r, 150)); // Wait at char change
    } 
}

async function clear() {
    await new Promise(r => {
        elements.insert.innerHTML = `${elements.insert.innerHTML.toString().slice(0, -1)}`;
        setTimeout(r, 100);
    });
}

animate_text();

window.onscroll = () => {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 30) {
        elements.wrapper.parentElement.classList.add('up');
    } else {
        elements.wrapper.parentElement.classList.remove('up');
    }
}

// -----------------------------------------------------------------------------------------
// CONTENTS BACKGROUND TEXT ANIMATIONS
// -----------------------------------------------------------------------------------------

show_bgs.forEach(show_bg => {
    show_bg.addEventListener('mouseenter', () => {
        contents_show_text(show_bg.innerText);
    });

    show_bg.addEventListener('mouseleave', () => {
        contents_hide_text();
    });
});

function contents_show_text(text) {
    if (text == 'WEB DEVELOPMENT') text = 'WEB DEV';
    if (text == 'PROGRAMMING') text = 'CODING';
    elements.background_text.innerText = text;
    elements.background_text.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
}

function contents_hide_text() {
    elements.background_text.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0% 100%)';
}