let speed = 0;
let attention = 0;
let fit_count = 0;
let time = 0;
let back_time = 0;
let get_time = 0;

let obstacle_play = true;
let obstacle_position = 0;
let Defeat = false;

// Создание приложение PixiJS
let app = new PIXI.Application({ width: window.innerWidth - 20, height: window.innerHeight - 20 });

// Добавление холста PixiJS на страницу
document.body.appendChild(app.view);

// Загрузка изображения анимации
let player_frames = [];
for (let i = 0; i < 32; i++) {
    player_frames.push(PIXI.Texture.from(`static/imgs/animations/person/traced-frame_${('00' + i).slice(-2)}_delay-0.04s.png`));
}

let obstacle_frames = [];
for (let i = 0; i < 59; i++) {
    obstacle_frames.push(PIXI.Texture.from(`static/imgs/animations/obstacle/frame_${('00' + i).slice(-2)}_delay-0.08s.png`));
}

let fight_frames = [];
for (let i = 0; i < 17; i++) {
    fight_frames.push(PIXI.Texture.from(`static/imgs/animations/fight/traced-frame_${('00' + i).slice(-2)}_delay-0.08s.png`));
}

// Создание игрока
let player = new PIXI.AnimatedSprite(player_frames);
player.animationSpeed = 0; // Скорость анимации
player.play(); // Запуск анимации

player.width = 400;
player.height = 300;

player.y = (app.screen.height - player.height) / 1.1;
player.x = 300;

// Создание заднего фона
let background1 = PIXI.Sprite.from('static/imgs/background.jpg');
let background2 = PIXI.Sprite.from('static/imgs/background.jpg');

background1.height = app.screen.height;
background2.height = app.screen.height;

// Позиция фонов
background1.x = 0;
background2.x = background1.width;

app.stage.addChild(background1);
app.stage.addChild(background2);

// Создание текстовых объектов для отображения скорости
let speedText = new PIXI.Text('Speed: ' + speed, { fill: 'white' });
speedText.position.set(app.screen.width - speedText.width - 10, 10);

// Создание текстовых объектов для отображения концентрации
let attentionText = new PIXI.Text('Attention: ' + attention, { fill: 'white' });
attentionText.position.set(app.screen.width - attentionText.width - 10, 40);

// Отображение времени
let timeText = new PIXI.Text('Time: ' + time, { fill: 'white' });
timeText.position.set(app.screen.width - timeText.width - 10, 70);

// Отображение париелгания
let fitText = new PIXI.Text('', { fill: 'white' });
fitText.text = 'CONNECTING...';
fitText.position.set(app.screen.width/2 - fitText.width/2, app.screen.height/2 - 15);

// Задний фон у прилегания
let fitBack = new PIXI.Graphics();
fitBack.beginFill(0x8C887D).drawRect(app.screen.width/2 - 300, app.screen.height/2 - 25, 600, 50).endFill();

app.stage.addChild(player);
app.stage.addChild(speedText);
app.stage.addChild(attentionText);
app.stage.addChild(timeText);
app.stage.addChild(fitBack);
app.stage.addChild(fitText);


function updateText() {
    // Обновление текст скорости
    speedText.text = 'Speed: ' + speed;
    speedText.position.set(app.screen.width - speedText.width - 10, 10);

    // Обновление текста концентрации
    attentionText.text = 'Attention: ' + attention;
    attentionText.position.set(app.screen.width - attentionText.width - 10, 40);

    // Обновление текста прилегания
    fitText.text = '';
    fitBack.alpha = 0;

    if (fit_count >= 1) {
        fitText.text = 'POOR FIT OF THE DEVICE TO THE HEAD';
        fitBack.alpha = 1;
    }

    fitText.position.set(app.screen.width/2 - fitText.width/2, app.screen.height/2 - 15);
}

function startGame() {
    background1.x -= speed;
    background2.x -= speed;

    player.animationSpeed = 0.25 * speed;

    // Если первый фон полностью вышел за пределы экрана
    if (background1.x <= -background1.width) {
        background1.x = background2.x + background2.width;

        back_time = 0;
    }

    // Если второй фон полностью вышел за пределы экрана
    if (background2.x <= -background2.width) {
        background2.x = background1.x + background1.width;

        back_time = 0;
    }
}

// Игровой цикл
app.ticker.add(() => {
    
    startGame();

    increaseTime();

    checkObstacle();

    if (back_time > 1630 - (window.innerWidth - 1488)) {
        createObstacle();
        back_time = 0;
    }

    if(get_time > 100 && !Defeat) {
        get_time = 0;
        sendGetToServer();
    }

    get_time += 1;
});

function increaseTime() {
    time += speed;
    back_time += speed;

    timeText.text = 'Time: ' + Math.round(time);
    timeText.position.set(app.screen.width - timeText.width - 10, 70);
}

function checkObstacle() {

    if (!obstacle_play && obstacle_position < 0){
        Defeat = true;
        console.log('Defeat')
        speed = 0;
        attention = 0;
        obstacle_play = true;

        startFight();

        showRestart();
    }
}

function showRestart() {
    // текстуры для кнопки
    const textureButtonNormal = PIXI.Texture.from('static/imgs/restart_button.png');
    const textureButtonHover = PIXI.Texture.from('static/imgs/restart_button_hover.png');

    // спрайт кнопки
    const button = new PIXI.Sprite(textureButtonNormal);
    button.anchor.set(0.5);
    button.x = app.screen.width / 2;
    button.y = app.screen.height / 1.13;
    button.height = 200;
    button.width = 300;

    // обработчики событий для кнопки
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerover', () => {
        button.texture = textureButtonHover;
    });
    button.on('pointerout', () => {
        button.texture = textureButtonNormal;
    });

    // обработчик события нажатия на кнопку
    button.on('pointertap', () => {
        window.location.reload();
    });

    // контейнер для элемента затемнения
    const overlayContainer = new PIXI.Container();
    app.stage.addChild(overlayContainer);

    // Создаем графику для затемнения
    const overlayGraphics = new PIXI.Graphics();
    overlayGraphics.beginFill(0x000000);
    overlayGraphics.drawRect(0, 0, app.screen.width, app.screen.height);
    overlayGraphics.endFill();

    // Функция для плавного появления затемнения
    function fadeInOverlay() {
        // начальное значение прозрачности
        overlayContainer.alpha = 0;

        gsap.to(overlayContainer, { alpha: 0.5, duration: 1 });
    }

    setTimeout(() => {
        overlayContainer.addChild(overlayGraphics);
        fadeInOverlay();
    }, 1000);

    setTimeout(() => {
        app.stage.addChild(button);
    }, 2000);
}

function startFight() {
    // Создание игрока
    let fight = new PIXI.AnimatedSprite(fight_frames);
    fight.animationSpeed = 0.5; // Скорость анимации

    fight.width = 500;
    fight.height = 400;

    fight.y = (app.screen.height - player.height) / 1.15;
    fight.x = 300;

    fight.play(); // Запуск анимации
    app.stage.addChild(fight);

    app.stage.removeChild(player);
}

// Создание препятствий
function createObstacle() {
    let obstacle_progress = 0;
    let start_anim_time = 360 // задержка перед запуском анимации
    obstacle_play = false;
    obstacle_position = 1050 + (window.innerWidth - 1480);

    // Создание препятствия
    const obstacle = new PIXI.AnimatedSprite(obstacle_frames);
    obstacle.animationSpeed = 0.5;
    obstacle.loop = false; // параметр loop в false, чтобы анимация проигрывалась только один раз
    obstacle.gotoAndStop(0);

    obstacle.width = 250;
    obstacle.height = 162;
    obstacle.y = app.screen.height / 1.4;
    obstacle.x = app.screen.width;

    // Добавление препятствия на сцену
    app.stage.addChild(obstacle);
    app.stage.addChild(player);

    // прогресс бар задний фон
    const progressBarContainer = new PIXI.Graphics();
    progressBarContainer.beginFill(0x8C887D);
    progressBarContainer.drawRect(0, 0, 190, 18);
    progressBarContainer.endFill();
    progressBarContainer.x = app.screen.width + 55;
    progressBarContainer.y = app.screen.height / 1.057;
    app.stage.addChild(progressBarContainer);

    // прогресс бар графика
    const progressBarFill = new PIXI.Graphics();
    progressBarFill.beginFill(0x00FF00);
    progressBarFill.drawRect(0, 0, 5, 10);
    progressBarFill.endFill();
    progressBarFill.x = app.screen.width + 60;
    progressBarFill.y = app.screen.height / 1.05;
    app.stage.addChild(progressBarFill);

    function updateProgressBar(progress) {
        progressBarFill.width = progress;
    }

    // Функция для движения препятствия и удаления его, если оно покидает сцену
    function moveAndRemove() {
        if (fit_count == 0){
            // Движение препятствия влево вместе с фоном
            obstacle.x -= speed;
            obstacle_position -= speed;

            progressBarFill.x -= speed;
            progressBarContainer.x -= speed;

            start_anim_time -= 1;
        
            obstacle_progress += 0.5;
            updateProgressBar(obstacle_progress);
        }

        if (Defeat) {
            // Удаление прогресс бара
            app.stage.removeChild(progressBarFill);
            app.stage.removeChild(progressBarContainer);
            app.stage.removeChild(obstacle);
        }

        if (start_anim_time < 0){
            if (!Defeat) obstacle.play();
            // Удаление прогресс бара
            app.stage.removeChild(progressBarFill);
            app.stage.removeChild(progressBarContainer);

            obstacle_play = true;
        }

        // Проверка, покинуло ли препятствие сцену
        if (obstacle_position < -200) {
            // Удаление препятствия из сцены
            app.stage.removeChild(obstacle);
            // Остановка вызова функции для данного препятствия
            app.ticker.remove(moveAndRemove);
        }
    }

    // Запуск функции для движения и удаления препятствия на каждом кадре
    app.ticker.add(moveAndRemove);
}


// Получение данных
// Создание WebSocket соединения
const socket = new WebSocket('ws://localhost:12345');

// Обработчик события открытия соединения
socket.onopen = function() {
  console.log('WebSocket connection established.');
};

// Обработчик события получения сообщения от сервера
socket.onmessage = function(event) {
    const receivedMessage = JSON.parse(event.data);
    console.log('Received message from server:', receivedMessage);

    speed = receivedMessage.speed;
    attention = receivedMessage.attention;

    if (receivedMessage.fit == 0){
        fit_count += 1;
    } else {
        fit_count = 0;
    }

    if (fit_count >= 3) {
        speed = 0;
        attention = 0;
    }

    updateText();
};

// Обработчик события закрытия соединения
socket.onclose = function() {
  console.log('WebSocket connection closed.');
};

function sendGetToServer(){
  // Запрос данных у сервера
  const dataToSend = { message: 'GET' };
  socket.send(JSON.stringify(dataToSend));
}


