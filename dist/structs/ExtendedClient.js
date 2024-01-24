"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedCient = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
dotenv_1.default.config();
const fileFilter = (fileName) => fileName.endsWith(".ts") || fileName.endsWith(".js");
class ExtendedCient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    buttons = new discord_js_1.Collection();
    selects = new discord_js_1.Collection();
    modals = new discord_js_1.Collection();
    constructor() {
        super({
            intents: Object.keys(discord_js_1.IntentsBitField.Flags),
            partials: [
                discord_js_1.Partials.Channel, discord_js_1.Partials.GuildMember, discord_js_1.Partials.GuildScheduledEvent,
                discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.ThreadMember, discord_js_1.Partials.User
            ]
        });
    }
    start() {
        this.registerModules();
        this.registerEvents();
        this.login(process.env.BOT_TOKEN);
    }
    registerCommands(commands) {
        this.application?.commands.set(commands)
            .then(() => {
            console.log("✅ Slash commands setup completed".green);
        })
            .catch(error => {
            console.log(`❌ Error ocurred when setting up slash commands. \n${error}`.red);
        });
    }
    registerModules() {
        const slashCommands = new Array();
        const commandsPath = path_1.default.join(__dirname, "..", "commands");
        fs_1.default.readdirSync(commandsPath).forEach(local => {
            fs_1.default.readdirSync(commandsPath + `/${local}/`).filter(fileFilter).forEach(async (fileName) => {
                const command = (await Promise.resolve(`${`../commands/${local}/${fileName}`}`).then(s => tslib_1.__importStar(require(s))))?.default;
                const { name, buttons, selects, modals } = command;
                if (name) {
                    this.commands.set(name, command);
                    slashCommands.push(command);
                    if (buttons)
                        buttons.forEach((run, key) => this.buttons.set(key, run));
                    if (selects)
                        selects.forEach((run, key) => this.selects.set(key, run));
                    if (modals)
                        modals.forEach((run, key) => this.modals.set(key, run));
                }
            });
        });
        this.on("ready", () => this.registerCommands(slashCommands));
    }
    registerEvents() {
        const eventsPath = path_1.default.join(__dirname, "..", "events");
        fs_1.default.readdirSync(eventsPath).forEach(local => {
            fs_1.default.readdirSync(`${eventsPath}/${local}`).filter(fileFilter)
                .forEach(async (fileName) => {
                const { name, once, run } = (await Promise.resolve(`${`../events/${local}/${fileName}`}`).then(s => tslib_1.__importStar(require(s))))?.default;
                try {
                    if (name)
                        (once) ? this.once(name, run) : this.on(name, run);
                }
                catch (error) {
                    console.log(`An error occurred on event: ${name} \n${error}`.red);
                }
            });
        });
    }
}
exports.ExtendedCient = ExtendedCient;
