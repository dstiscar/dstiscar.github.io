class Game extends Phaser.Scene {
    graphics;
    curve;
    path;
    constructor() {
        super("Game");
        this.my = {sprite: {}, text: {}};
        this.my.sprite.pbullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.ebullet = [];
        
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "playerShip1_blue.png");
        this.load.image("pBullet", "laserBlue04.png");
        this.load.image("enemy0", "enemyGreen3.png");
        this.load.image("enemy1", "enemyRed4.png");

        this.load.image("eBullet0", "laserRed08.png");
        this.load.image("eBullet1", "laserRed09.png");
        this.load.image("eBullet2", "laserRed10.png");
        this.load.image("eBullet3", "laserRed11.png");

        this.load.image("boom0", "whitePuff00.png");
        this.load.image("boom1", "whitePuff01.png");
        this.load.image("boom2", "whitePuff02.png");
        this.load.image("boom3", "whitePuff03.png");

        this.load.image("health", "playerLife1_blue.png");
        this.load.image("background", "blue.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("eShoot", "laserSmall_000.ogg");
        this.load.audio("pShoot", "laserSmall_002.ogg");
        this.load.audio("boom", "explosionCrunch_000.ogg");
        this.load.audio("damage", "impactPlate_heavy_000.ogg");
        this.load.audio("zoom", "forceField_000.ogg");
    }

    create() {
        
        
        let my = this.my;

        let background = this.add.sprite(0, -160, "background");
        background.scaleX = 7;
        background.scaleY = 6;

        my.text.gameover1 = this.add.bitmapText(300, 200, "rocketSquare", "Game Over");
        my.text.gameover2 = this.add.bitmapText(185, 250, "rocketSquare", "Press Q to try again");

        my.sprite.player = this.add.sprite(400, 500, "player");

        this.init_game();

        this.anims.create({
            key: "eBullet",
            frames: [
                {key: "eBullet0"},
                {key: "eBullet1"},
                {key: "eBullet2"},
                {key: "eBullet3"}
            ],
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: "boom",
            frames: [
                { key: "boom0" },
                { key: "boom1" },
                { key: "boom2" },
                { key: "boom3" }
            ],
            frameRate: 50,
            repeat: 0,
            hideOnComplete: true
        });


        this.pBulletSpeed = 40;
        this.eBulletSpeed = 5;

        my.text.score = this.add.bitmapText(20, 0, "rocketSquare", "Score " + this.myScore);
        my.text.health = this.add.bitmapText(750, 0, "rocketSquare", this.health);
        this.add.sprite(725, 20, "health");

        

        this.restart = this.input.keyboard.addKey("Q");

        document.getElementById('description').innerHTML = '<h2>Ship Shooter</h2><br>Mouse Keys to Move, Left-click to Shoot'

    }

    update() {
        let my = this.my;
        var pointer = this.input.activePointer;

        if(this.health == 0){
            my.sprite.player.y = -200;
        }else{
            my.sprite.player.x = pointer.x;
            my.sprite.player.y = 550;
        }
        
        if(my.sprite.player.x < 50) my.sprite.player.x = 50;
        if(my.sprite.player.x > 750) my.sprite.player.x = 750;

        if(pointer.isDown){
            if(!this.bulletActive){
                this.sound.play("pShoot");
                my.sprite.pbullet.push(this.add.sprite(my.sprite.player.x, my.sprite.player.y -20, "pBullet"));
            }
        }

        for (let bullet of my.sprite.pbullet) {
            bullet.y -= this.pBulletSpeed;
            for(let enemy of my.sprite.enemy){
                if(this.collides(bullet, enemy)){
                    this.myScore += enemy.points;
                    enemy.visible = false;
                    this.sound.play("boom",{rate: 2});
                    this.add.sprite(enemy.x, enemy.y, "boom").setScale(0.3).play("boom");
                    enemy.y = 800;
                    bullet.y = -100;
                    break;
                }
            }
        }

        for (let bullet of my.sprite.ebullet) {
            bullet.y += this.eBulletSpeed;
            if(this.collides(bullet, my.sprite.player)){
                bullet.y = 650;
                if (this.cooldown == 0){
                    this.sound.play("damage");
                    this.health -= 1;
                    this.cooldown = 20;
                }
            }
        }


        if(this.health > 0){
            this.nextWave--;
            if(this.nextWave < 0){
                if(Math.random()>0.5){
                    let spawnpos = 50+(Math.random()*150);
                    if(Math.random()>0.5){
                        this.createEnemy(
                        [-50-(Math.random()*50),spawnpos,
                        950+(Math.random()*150),spawnpos],
                        0,1800);
                    }else{
                        this.createEnemy(
                            [900+(Math.random()*50),spawnpos,
                            -100-(Math.random()*150),spawnpos],
                            0,1800);
                    }
                }else{
                    let spawnpos = 150+(Math.random()*500);
                    this.createEnemy(
                        [spawnpos,-50, 
                        spawnpos,160, 
                        spawnpos,820],
                        1,1500);
                    this.createEnemy(
                        [spawnpos-150,-50, 
                        spawnpos-90,160, 
                        spawnpos-90,820],
                        1,1500);
                    this.createEnemy(
                        [spawnpos+150,-50, 
                        spawnpos+90,160, 
                        spawnpos+90,820],
                        1,1500);
                }
                this.nextWave = 50 + (Math.random()*50);
            }
        }


        for (let enemy of my.sprite.enemy) {
            if(enemy.type == 0){
                if(enemy.count == 20){
                    this.sound.play("eShoot");
                    my.sprite.ebullet.push(this.add.sprite(enemy.x,enemy.y+50,"eBullet").play("eBullet"));
                    enemy.count = 0;
                }
                
            }
            if(enemy.type == 1){
                if(enemy.count == 40){
                    this.sound.play("zoom",{volume: 0.3});
                }
                if(this.collides(enemy, my.sprite.player)){
                    if (this.cooldown == 0){
                        this.sound.play("damage");
                        this.health -= 1;
                        this.cooldown = 20;
                    }
                }
                
            }
            enemy.count++;
        }

        
        my.sprite.pbullet = my.sprite.pbullet.filter((bullet) => bullet.y > -50);
        my.sprite.ebullet = my.sprite.ebullet.filter((bullet) => bullet.y < 640);
        my.sprite.enemy = my.sprite.enemy.filter((enemy) => enemy.y < 800 && enemy.x < 950 && enemy.x > -100);
        if(my.sprite.pbullet.length > 0) this.bulletActive = true;
        else this.bulletActive = false;

        this.cooldown--;
        if(this.health == 0){
            my.sprite.player.visible = false;

            if(this.cooldown == 19){
                this.sound.play("boom");
                this.add.sprite(my.sprite.player.x+20, 530, "boom").setScale(0.3).play("boom");
            }
            if(this.cooldown == 16) this.add.sprite(my.sprite.player.x-20, 550, "boom").setScale(0.3).play("boom");
            if(this.cooldown == 13) this.add.sprite(my.sprite.player.x, 570, "boom").setScale(0.3).play("boom");
        }else{
            
            if(this.cooldown%4 == 3) my.sprite.player.visible = false;
            if(this.cooldown%4 == 1) my.sprite.player.visible = true;
            
        }
        if(this.cooldown < 0) this.cooldown = 0;

        if(this.health == 0){
            my.text.gameover1.visible = true;
            my.text.gameover2.visible = true;
            if (Phaser.Input.Keyboard.JustDown(this.restart)) {
                this.init_game();
            }
        }


        this.updateUI();

    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    createEnemy(points,type,dur){
        let curve = new Phaser.Curves.Spline(points);
        let en = this.add.follower(curve,curve.points[0].x, curve.points[0].y, "enemy"+type);
        en.type = type;
        en.count = 0;
        if(type == 0) en.points = 20;
        if(type == 1) en.points = 10;

        this.my.sprite.enemy.push(en);
        en.startFollow({
            duration: dur,
            rotateToPath: true,
            rotationOffset: -90
        });
    }

    updateUI(){
        this.my.text.score.setText("Score " + this.myScore);
        this.my.text.health.setText(this.health);
    }

    init_game(){
        for(let i of this.my.sprite.pbullet) i.visible = false;
        for(let i of this.my.sprite.enemy) i.visible = false;
        for(let i of this.my.sprite.ebullet) i.visible = false;

        this.my.sprite.pbullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.ebullet = [];
        this.bulletActive = false;
        this.myScore = 0;
        this.cooldown = 0;
        this.health = 3;
        this.nextWave = 50;

        this.my.sprite.player.visible = true;
        this.my.text.gameover1.visible = false;
        this.my.text.gameover2.visible = false;
    }

}