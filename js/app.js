const GRID_WIDTH = 101, GRID_HEIGHT = 83;
let START, T ,SECOND, MOVES;
// 这是我们的玩家要躲避的敌人 
class Enemy {
    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    // 初始化敌人位置为随机位置，速度调用速度产生方程产生随机速度
    constructor(sprite = 'images/enemy-bug.png') {
        this.sprite = sprite;
        this.x = (4 - Math.round(Math.random()*8)) * GRID_WIDTH;
        this.y = (1 + Math.round(Math.random()*2)) * GRID_HEIGHT;
        this.speed = this.speeds();
    }

    // 设置1-3范围的速度随机值
    speeds() {
        return GRID_WIDTH * (Math.random()*3 + 1);
    }

    // 此为游戏必须的函数，用来更新敌人的位置
    // 当敌人从右边离开屏幕重置随机位置与随机速度
    // 参数: dt ，表示时间间隙
    update(dt) {
        // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
        // 都是以同样的速度运行的
        if (this.x < 505) {
            this.x += dt * this.speed;
        } else {
            this.x = -(GRID_WIDTH * (Math.random()+1));
            this.y = (1 + Math.round(Math.random()*2)) * GRID_HEIGHT;
            this.speed = this.speeds();
        }
    };

    // 此为游戏必须的函数，用来在屏幕上画出敌人，
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y-15);
    };
};


// 玩家类
// update() 函数检查玩家是否和敌人发生碰撞， render() 在屏幕上画出玩家
// handleInput()函数控制玩家位移
class Player extends Enemy {
    constructor(sprite = 'images/char-boy.png') {
        super(sprite);
        this.x = 2 * GRID_WIDTH;
        this.y = 5 * GRID_HEIGHT;
    }

    render() {
        super.render();
    }

    update(dt) {
        for (const ememy of allEnemies) {
            if (ememy.y === this.y) {
                if (Math.abs(ememy.x-this.x) < 90) {
                    Engine[0]();
                }
            }
        }

    }

    reset() {
        this.x = 2 * GRID_WIDTH;
        this.y = 5 * GRID_HEIGHT;
    }

    handleInput(key) {
        switch(key){
            case 'down':
                if(this.y < 415) {
                    this.y += GRID_HEIGHT;
                    $('.moves').text(++MOVES);
                }
                break;
            case 'up':
                if (this.y > GRID_HEIGHT) {
                    this.y -= GRID_HEIGHT;
                    $('.moves').text(++MOVES);
                }
                break;
            case 'left':
                if (this.x > 0) {
                    this.x -= GRID_WIDTH;
                    $('.moves').text(++MOVES);
                }
                break;
            case 'right':
                if (this.x < 404) {
                    this.x += GRID_WIDTH;
                    $('.moves').text(++MOVES);
                }
        }

    }
}

// 新增道具类，目前实现钥匙和传送门的变化、可扩展收藏物品等道具
class Props extends Player {
    constructor(name='key', sprite = 'images/Key.png') {
        super(sprite);
        this.name = name;
        this.location();
    }

    render() {
        super.render();
    }
    // 根据道具名称不同确定刷新位置、可添加扩展其他类型道具
    location() {
        switch(this.name){
            case 'key':
                this.x = 4 * GRID_WIDTH;
                this.y = 1 * GRID_HEIGHT;
                break;
            case 'Selector':
                this.x = 0 * GRID_WIDTH;
                this.y = 5 * GRID_HEIGHT;
                break;
        }
    }
    // 碰撞检测
    update(dt) {
        if (player.y === this.y) {
            if (player.x === this.x) {
                this.change();
            }
        }
    }
    // 重置
    reset() {
        switch(this.name){
            case 'Selector':
                this.sprite = 'images/Key.png';
                this.name = 'key'
                this.location();
                break;
        }
    }
    // 碰撞之后进行变换、吃了钥匙之后刷新出传送门，碰到门游戏结束
    change() {
        switch(this.name){
            case 'key':
                this.sprite = 'images/Selector.png';
                this.name = 'Selector'
                this.location();
                break;
            case 'Selector':
                Engine[1]();
                break;
        }
    }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面、钥匙道具放 key
let allEnemies = [];
const player = new Player();
for (let i = 4; i >= 0; i--) {
    allEnemies[i] = new Enemy();
}
const key = new Props();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
// 新增wsad作为方向键控制
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// 监听鼠标输入，并且代表将移动方向的关键数字送到 Play.handleInput()
$('body').on('click', function(evt) {
    const x = evt.pageX - $('canvas').offset().left;
    const y = evt.pageY - $('canvas').offset().top - 50;
    if ((player.x+GRID_WIDTH) > x && x > player.x) {
        if (player.y > y) {
            player.handleInput('up');
        } else if (y > (player.y+GRID_HEIGHT)) {
            player.handleInput('down');
        }
    }
    if ((player.y+GRID_HEIGHT) > y && y > player.y) {
        if (player.x >x) {
            player.handleInput('left');
        } else if (x > (player.x+GRID_HEIGHT)) {
            player.handleInput('right');
        }
    }; 
})

//计时器，提供游戏计时；
function startTime() {
    $('.second').text(++SECOND);
}

//点击重启按键刷新页面，游戏界面和胜利提示框相同。
$('.restart').on("click",function() {
    location.reload(true);
})