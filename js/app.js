// 这是我们的玩家要躲避的敌人 
class Enemy {
    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    // 初始化敌人位置为随机位置，速度调用速度产生方程产生随机速度
    constructor(sprite = 'images/enemy-bug.png') {
        this.sprite = sprite;
        this.x = (4 - Math.round(Math.random()*8)) * 101;
        this.y = (1 + Math.round(Math.random()*2)) * 83;
        this.speed = this.speeds();
    }

    // 设置1-3范围的速度随机值
    speeds() {
        return 101 * (Math.random()*3 + 1);
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
            this.x = -(101 * (Math.random()+1));
            this.y = (1 + Math.round(Math.random()*2)) * 83;
            this.speed = this.speeds();
        }
    };

    // 此为游戏必须的函数，用来在屏幕上画出敌人，
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};


// 玩家类
// update() 函数检查玩家是否和敌人发生碰撞， render() 在屏幕上画出玩家
// handleInput()函数控制玩家位移
class Player extends Enemy {
    constructor(sprite = 'images/char-boy.png') {
        super(sprite);
        this.x = 2 * 101;
        this.y = 5 * 83;
    }

    update(dt) {
        for (const ememy of allEnemies) {
            if (ememy.y === this.y) {
                if (Math.abs(ememy.x-this.x) < 90) {
                    this.x = 2 * 101;
                    this.y = 5 * 83;
                }
            }
        }

    }
    render() {
        super.render();
    }
    handleInput(key) {
        switch(key){
            case 'down':
                if(this.y < 415) {
                    this.y += 83;
                }
                break;
            case 'up':
                if (this.y > 83) {
                    this.y -= 83;
                }
                break;
            case 'left':
                if (this.x > 0) {
                    this.x -= 101;
                }
                break;
            case 'right':
                if (this.x < 404) {
                    this.x += 101;
                }
        }

    }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
let allEnemies = [];
const player = new Player();
for (let i = 4; i >= 0; i--) {
    allEnemies[i] = new Enemy();
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
