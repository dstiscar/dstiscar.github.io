"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    width: 800,
    height: 600,
    scene: [Game]
}

const game = new Phaser.Game(config);