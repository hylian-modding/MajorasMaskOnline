import { InjectCore } from "modloader64_api/CoreInjection";
import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { Command } from "modloader64_api/OOT/ICommandBuffer";
import { Music, SoundSourceStatus } from "modloader64_api/Sound/sfml_audio";
import { FlipFlags, Texture } from "modloader64_api/Sylvain/Gfx";
import fs from 'fs';
import path from 'path';
import { rgba, xy, xywh } from "modloader64_api/Sylvain/vec";
import { onTick, onViUpdate } from "modloader64_api/PluginLifecycle";
import { IMMCore } from "MajorasMask/API/MMAPI";

export class CreditsController {

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: IMMCore;
    playingCredits: boolean = false;
    creditsInterval: any;
    needsSlideChange: boolean = false;
    playedCredits: boolean = false;
    creditsMusic!: Music;
    assets!: Map<string, Buffer>;
    currentCreditsSlide!: Texture;
    totalSlidesShown: number = 0;
    eventDisabled: boolean = false;
    creditsDone: boolean = false;
    atLastBoss: boolean = false;

    @onTick()
    onTick() {
        if (this.playingCredits) {
            this.core.commandBuffer.runCommand(Command.PLAY_MUSIC, 0);
        }
    }

    @onViUpdate()
    onVi() {
        if (this.eventDisabled) {
            return;
        }
        if (this.playingCredits) {
            if (this.creditsMusic === undefined) {
                this.creditsMusic = this.ModLoader.sound.initMusic(this.assets.get("assets/music/credits.ogg")!);
                this.creditsMusic.volume = 50;
                return;
            }
            if (this.creditsMusic.status !== SoundSourceStatus.Playing && !this.creditsDone) {
                this.core.commandBuffer.runCommand(Command.PLAY_MUSIC, 0);
                this.creditsMusic.stop();
                this.creditsMusic.play();
                this.needsSlideChange = true;
            }
            if (this.needsSlideChange) {
                if (this.assets.has("assets/credits/" + "slide" + this.totalSlidesShown + ".png")) {
                    this.currentCreditsSlide = this.ModLoader.Gfx.createTexture();
                    fs.writeFileSync(path.resolve(__dirname, "slide" + this.totalSlidesShown + ".png"), this.assets.get("assets/credits/" + "slide" + this.totalSlidesShown + ".png")!);
                    this.currentCreditsSlide.loadFromFile(path.resolve(__dirname, "slide" + this.totalSlidesShown + ".png"));
                    this.totalSlidesShown++;
                } else {
                    // ran out of slides?
                    clearInterval(this.creditsInterval);
                    this.creditsInterval = undefined;
                    this.creditsDone = true;
                }
                this.needsSlideChange = false;
            }
            this.ModLoader.ImGui.getWindowDrawList().addRectFilled(xy(0, 0), xy(this.ModLoader.ImGui.getWindowWidth(), this.ModLoader.ImGui.getWindowHeight()), rgba(0, 0, 0, 0xFF));
            if (this.currentCreditsSlide !== undefined) {
                this.ModLoader.Gfx.addSprite(this.ModLoader.ImGui.getWindowDrawList(), this.currentCreditsSlide, xywh(0, 0, this.currentCreditsSlide.width, this.currentCreditsSlide.height), xywh(0, 0, this.ModLoader.ImGui.getMainViewport().size.x, this.ModLoader.ImGui.getMainViewport().size.y), rgba(255, 255, 255, 255), FlipFlags.None);
            }
            return;
        }
        if (this.core.global.current_scene === 11){
            this.atLastBoss = true;
            return;
        }
        if (this.atLastBoss && this.core.global.current_scene === 45 && !this.playingCredits && !this.playedCredits) {
            this.playingCredits = true;
            this.creditsInterval = setInterval(() => {
                if (this.playingCredits) {
                    this.needsSlideChange = true;
                    this.playedCredits = true;
                }
            }, 10 * 1000);
        }
    }

}