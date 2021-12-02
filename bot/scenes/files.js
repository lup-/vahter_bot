const fs = require('fs');
const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;

module.exports = function () {
    const scene = new BaseScene('files');

    scene.enter(async ctx => {
        const bot = ctx.scene.state.bot;
        await ctx.reply( bot.fileMessage );
        for (let file of bot.files) {
            let data = fs.readFileSync(file.serverFile.path);

            await ctx.telegram.sendDocument(ctx.from.id, {
                source: data,
                filename: file.name
            });
        }
    });

    return scene;
}