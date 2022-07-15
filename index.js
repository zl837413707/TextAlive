const { Player, stringToDataUrl } = TextAliveApp;
// TextAlive Player を初期化
const player = new Player({

    app: { token: "OM93Fid1PzT0tJDk" },

    mediaElement: document.querySelector("#media"),

    mediaBannerPosition: "bottom right"
});

let overlay = document.querySelector(".overlay");
let textContainer = document.querySelector("#text");
let Count = document.querySelector('.count');
let count = Count.querySelectorAll('i');

let c;

player.addListener({
    /* APIの準備ができたら呼ばれる */
    onAppReady(app) {

        if (app.managed) {

            document.querySelector("#control").className = "disabled";
        }

        if (!app.songUrl) {

            document.querySelector("#media").className = "disabled";

            player.createFromSongUrl("https://piapro.jp/t/GqT2/20220129182012");
        }
    },

    /* 楽曲情報が取れたら呼ばれる */
    onVideoReady() {

        document.querySelector("#artist span").textContent = player.data.song.artist.name;

        document.querySelector("#song span").textContent = player.data.song.name;

        c = null;
    },

    onTimerReady() {

        overlay.className = "disabled";

    },


    onTimeUpdate(position) {

        if (!player.video.firstChar) {

            return;
        }

        if (c && c.startTime > position + 1000) {
            resetChars();
        }

        let current = c || player.video.firstChar;

        while (current && current.startTime < position + 200) {

            if (c !== current) {

                newChar(current);

                c = current;

            }

            current = current.next;
        }
    },
    // ボダン
    onPlay() {

        const a = document.querySelector("#control > a#play");

        a.className = 'icon-pause';


    },

    onPause() {

        const a = document.querySelector("#control > a#play");

        a.className = 'icon-play2';
    }

});

/* 再生・一時停止ボタン */
document.querySelector("#control > a#play").addEventListener("click", (e) => {

    e.preventDefault();

    if (player) {

        if (player.isPlaying) {

            player.requestPause();

            for (let i = 0; i < 3; i++) {
                count[0].classList.remove('ani');
                count[1].classList.remove('ani1');
                count[2].classList.remove('ani2');
            }
        } else {

            player.requestPlay();

            for (let i = 0; i < 3; i++) {
                count[0].classList.add('ani');
                count[1].classList.add('ani1');
                count[2].classList.add('ani2');
            }
        }
    }
    return false;
});
/* 停止ボタン */
document.querySelector("#control > a#stop").addEventListener("click", (e) => {

    e.preventDefault();

    if (player) {

        player.requestStop();

        for (let i = 0; i < 3; i++) {
            count[i].innerHTML = 0
        }

        for (let i = 0; i < 3; i++) {
            count[0].classList.remove('ani');
            count[1].classList.remove('ani1');
            count[2].classList.remove('ani2');
        }

        textContainer.innerHTML = '';
    }
    return false;
});


// 星
function starInit(starCount) {

    let starArea = document.querySelector("#lyrics")

    for (let i = 0; i < starCount; i++) {

        let star = document.createElement("i");

        star.style.display = "inline-block";

        star.classList.add("star");

        starArea.appendChild(star);
    }

    for (let i = 0; i < starCount; i++) {

        let star = document.createElement("i");

        star.style.display = "inline-block";

        star.classList.add("star_1");

        starArea.appendChild(star);
    }

    for (let i = 0; i < starCount; i++) {

        let star = document.createElement("i");

        star.style.display = "inline-block";

        star.classList.add("star_2");

        starArea.appendChild(star);
    }
}

function starPosition(starCount) {

    starInit(starCount);

    let stars = document.querySelectorAll(".star");

    let stars_1 = document.querySelectorAll(".star_1");

    let stars_2 = document.querySelectorAll(".star_2");

    for (let i = 0; i < starCount; i++) {

        let left = Math.floor(Math.random() * window.innerWidth);

        let top = Math.floor(Math.random() * window.innerHeight / 1.5);

        let left_1 = Math.floor(Math.random() * window.innerWidth);

        let top_1 = Math.floor(Math.random() * window.innerHeight / 1.5);

        let left_2 = Math.floor(Math.random() * window.innerWidth);

        let top_2 = Math.floor(Math.random() * window.innerHeight / 1.5);

        stars[i].style.left = left + 'px';

        stars[i].style.top = top + 'px';

        stars_1[i].style.left = left_1 + 'px';

        stars_1[i].style.top = top_1 + 'px';

        stars_2[i].style.left = left_2 + 'px';

        stars_2[i].style.top = top_2 + 'px';

        stars_2[i].style.animationDelay = Math.floor(Math.random().toFixed(1) * i) + 's';
    }
}

starPosition(70);

// 花火
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let firework_particles = 50;
let base_speed = 1;
let firework_lifespan = 400;
let particle_speed = 2;
let gravity = 9.8;

let particles = [];

let loop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, i) => {

        particle.animate();

        particle.render();
        if (particle.y > canvas.height

            || particle.x < 0

            || particle.x > canvas.width

            || particle.alpha <= 0
        ) {

            particles.splice(i, 1);
        }
    });

    requestAnimationFrame(loop);
};

let createFirework = (

    x = Math.random() * canvas.width,

    y = Math.random() * canvas.height
) => {

    let speed = (Math.random() * 2) + base_speed;

    let maxSpeed = speed;

    let red = ~~(Math.random() * 255);

    let green = ~~(Math.random() * 255);

    let blue = ~~(Math.random() * 255);

    red = (red < 150 ? red + 150 : red);

    green = (green < 150 ? green + 150 : green);

    blue = (blue < 150 ? blue + 150 : blue);

    for (let i = 0; i < firework_particles; i++) {

        let particle = new Particle(x, y, red, green, blue, speed);

        particles.push(particle);

        maxSpeed = (speed > maxSpeed ? speed : maxSpeed);
    }

    for (let i = 0; i < 40; i++) {

        let particle = new Particle(x, y, red, green, blue, maxSpeed, true);

        particles.push(particle);
    }

};

class Particle {

    constructor(

        x = 0,

        y = 0,

        red = ~~(Math.random() * 255),

        green = ~~(Math.random() * 255),

        blue = ~~(Math.random() * 255),

        speed,

        isFixedSpeed
    ) {

        this.x = x;

        this.y = y;

        this.red = red;

        this.green = green;

        this.blue = blue;

        this.alpha = 0.05;

        this.radius = 1 + Math.random();

        this.angle = Math.random() * 360;

        this.speed = (Math.random() * speed) + 0.1;

        this.velocityX = Math.cos(this.angle) * this.speed;

        this.velocityY = Math.sin(this.angle) * this.speed;

        this.startTime = (new Date()).getTime();

        this.duration = Math.random() * 300 + firework_lifespan;

        this.currentDiration = 0;

        this.dampening = 30;

        this.colour = this.getColour();

        if (isFixedSpeed) {

            this.speed = speed;

            this.velocityY = Math.sin(this.angle) * this.speed;

            this.velocityX = Math.cos(this.angle) * this.speed;
        }

        this.initialVelocityX = this.velocityX;

        this.initialVelocityY = this.velocityY;

    }

    animate() {

        this.currentDuration = (new Date()).getTime() - this.startTime;

        if (this.currentDuration <= 200) {

            this.x += this.initialVelocityX * particle_speed;

            this.y += this.initialVelocityY * particle_speed;

            this.alpha += 0.01;

            this.colour = this.getColour(240, 240, 240, 0.9);

        } else {
            this.x += this.velocityX;

            this.y += this.velocityY;

            this.colour = this.getColour(this.red, this.green, this.blue, 0.4 + (Math.random() * 0.3));

        }

        this.velocityY += gravity / 1000;

        if (this.currentDuration >= this.duration) {

            this.velocityX -= this.velocityX / this.dampening;

            this.velocityY -= this.velocityY / this.dampening;
        }

        if (this.currentDuration >= this.duration + this.duration / 1.1) {

            this.alpha -= 0.02;

            this.colour = this.getColour();

        } else {

            if (this.alpha < 1) {

                this.alpha += 0.03;
            }

        }
    }

    render() {

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);

        ctx.lineWidth = this.lineWidth;

        ctx.fillStyle = this.colour;

        ctx.shadowBlur = 8;

        ctx.shadowColor = this.getColour(this.red + 150, this.green + 150, this.blue + 150, 1);

        ctx.fill();

    }

    getColour(red, green, blue, alpha) {

        return `rgba(${red || this.red}, ${green || this.green}, ${blue || this.blue}, ${alpha || this.alpha})`;

    }

}

let updateCanvasSize = () => {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;
};

updateCanvasSize();

textContainer.addEventListener('click', (e) => {

    createFirework(e.clientX, e.clientY);

    disableAutoFireworks = true;

})

loop();


let Btn = document.querySelector('.Btn');
let menu = document.querySelector('.control');

let flag = 0

Btn.addEventListener('click', () => {
    if (flag == 0) {
        menu.style.marginTop = 0;
        flag = 1
    } else {
        menu.style.marginTop = '-' + 150 + 'px';
        flag = 0
    }

})

let oParent = document.querySelectorAll('.parent');
let oDiv1 = document.querySelector('.div1');
let oDiv2 = document.querySelector('.div2');
let oDiv3 = document.querySelector('.div3');

// control_fontsize
oDiv1.addEventListener('mousedown', (ev) => {

    let oEvent = ev;

    let disX = oEvent.clientX - oDiv1.offsetLeft;

    document.onmousemove = (ev) => {

        let oEvent = ev;

        let l = oEvent.clientX - disX;

        if (l < 0) {

            l = 0;
        } else if (l > oParent[0].offsetWidth - oDiv1.offsetWidth) {

            l = oParent[0].offsetWidth - oDiv1.offsetWidth;
        }

        oDiv1.style.left = l + 'px';

        let scale = l / (oParent[0].offsetWidth - oDiv1.offsetWidth);

        textContainer.style.fontSize = scale * 20 + 40 + 'px';

    };

    document.onmouseup = function () {

        document.onmousemove = null;

        document.onmouseup = null;
    };

})

// control_firework_particles
oDiv2.addEventListener('mousedown', function (ev) {

    let oEvent = ev;

    let disX = oEvent.clientX - oDiv2.offsetLeft;

    document.onmousemove = function (ev) {

        let oEvent = ev;

        let l = oEvent.clientX - disX;

        if (l < 0) {

            l = 0;
        } else if (l > oParent[1].offsetWidth - oDiv2.offsetWidth) {

            l = oParent[1].offsetWidth - oDiv2.offsetWidth;
        }

        oDiv2.style.left = l + 'px';

        let scale = l / (oParent[1].offsetWidth - oDiv2.offsetWidth);

        firework_particles = scale * 150 + 50;


    };

    document.onmouseup = function () {

        document.onmousemove = null;

        document.onmouseup = null;
    };

})

// control_firework_base_speed
oDiv3.addEventListener('mousedown', function (ev) {

    let oEvent = ev;

    let disX = oEvent.clientX - oDiv3.offsetLeft;

    document.onmousemove = function (ev) {

        let oEvent = ev;

        let l = oEvent.clientX - disX;

        if (l < 0) {

            l = 0;
        } else if (l > oParent[2].offsetWidth - oDiv3.offsetWidth) {

            l = oParent[2].offsetWidth - oDiv3.offsetWidth;
        }

        oDiv3.style.left = l + 'px';

        let scale = l / (oParent[2].offsetWidth - oDiv3.offsetWidth);

        base_speed = scale * 4 + 0.5;

    };

    document.onmouseup = function () {

        document.onmousemove = null;
        document.onmouseup = null;
    };

})

// 歌詞の表示
function newChar(current) {

    let word = document.createElement("i")

    word.appendChild(document.createTextNode(current.text))

    // 流れ星
    let div = document.createElement("span")

    let left = Math.floor(Math.random() * window.innerWidth / 1.1)

    let top = Math.floor(Math.random() * window.innerHeight / 2.5)

    div.style.left = left + 200 + 'px'

    div.style.top = top + 'px'

    word.style.left = left + 165 + 'px'

    word.style.top = top - 20 + 'px'


    word.addEventListener('click', () => {

        word.remove()

        if (count[2].innerHTML < 9 && count[1].innerHTML <= 9) {

            count[2].innerHTML++
        } else if (

            count[2].innerHTML == 9 && count[1].innerHTML < 9
        ) {

            count[2].innerHTML = 0

            count[1].innerHTML++
        } else if (

            count[2].innerHTML == 9 && count[1].innerHTML == 9
        ) {

            count[2].innerHTML = 0

            count[1].innerHTML = 0

            count[0].innerHTML++
        }

    })

    let container = document.createElement("div");

    container.appendChild(div);

    container.appendChild(word)

    textContainer.appendChild(container);

    if (current.endTime === player.video.endTime) {
        setTimeout(function () {
            for (let i = 0; i < 3; i++) {
                count[0].classList.remove('ani');
                count[1].classList.remove('ani1');
                count[2].classList.remove('ani2');
                count[i].innerHTML = 0;
            }
        }, 31000)

    }

    setTimeout(function () {
        container.remove();
    }, 6000)
}

function resetChars() {
    c = null;
    while (textContainer.firstChild)
        textContainer.removeChild(textContainer.firstChild)
}



