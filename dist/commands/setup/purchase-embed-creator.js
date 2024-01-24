"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structs/types/Command");
const __1 = require("../..");
const purchaseChannel = "1180567148943376534";
const productsChannel = "1180567096149672057";
const feedbackChannel = "1180567360332124160";
exports.default = new Command_1.Command({
    name: "purchase-embed",
    description: "Criar embed de compras",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: discord_js_1.PermissionFlagsBits.Administrator,
    async run({ interaction, options }) {
        const selectedOption = options.getString("default");
        const targetChannel = await interaction.client.channels.fetch(purchaseChannel);
        const tutorialEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("🛒 Como Comprar")
            .setDescription(`Para efetuar uma compra em nossa loja, siga os passos abaixo:
            
            Primeiro, vá ao canal de produtos: <#${productsChannel}> e escolha o produto que deseja comprar.
            
            Após isso, nesse mesmo canal, selecione o produto desejado. Quando selecionar, escolha o método de pagamento que deseja utilizar.
            Após isso, um ticket será criado, basta seguir as etapas enviadas no ticket.

            Para checar o feedback de compradores passados, vá ao canal <#${feedbackChannel}>.`)
            .setColor(__1.config.colors["green-dark"])
            .setImage("https://media.discordapp.net/attachments/1180572591111544942/1181659773863727124/New_Project.png")
            .setFooter({
            text: "© 2023-2024 by Bagre Store",
            iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png",
        })
            .setTimestamp();
        const comprarButton = new discord_js_1.ButtonBuilder()
            .setCustomId('comprar')
            .setLabel('Comprar')
            .setStyle(discord_js_1.ButtonStyle.Primary);
        const row = new discord_js_1.ActionRowBuilder().addComponents(comprarButton);
        if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({
                embeds: [tutorialEmbed],
                components: [row]
            });
        }
        const newChannelEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("🛒 Compra")
            .setDescription(`Olá! Muito obrigado por criar um ticket conosco para efetuar uma compra!
            Espere um carregador de V-Bucks entrar em contato com você.

            Para facilitar o processo, siga o formulário abaixo:
            Email da conta:
            Senha da conta:
            Possui ADF:
            Quantidade de skins/vbucks:
            Plataforma que joga:`)
            .setColor(__1.config.colors["green-dark"])
            .setImage("https://media.discordapp.net/attachments/1180572591111544942/1181659773863727124/New_Project.png")
            .setFooter({
            text: "© 2023-2024 by Bagre Store",
            iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png",
        })
            .setTimestamp();
        const filter = (i) => {
            return ['comprar', 'pix', 'vbucks', 'skins'].includes(i.customId) && i.user.id === interaction.user.id;
        };
        if (!interaction.channel) {
            return;
        }
        const collector = interaction.channel.createMessageComponentCollector({ filter });
        collector.on('collect', async (i) => {
            if (i.customId === 'comprar') {
                const pixButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('pix')
                    .setLabel('Pix')
                    .setStyle(discord_js_1.ButtonStyle.Success);
                const row = new discord_js_1.ActionRowBuilder().addComponents(pixButton);
                await i.reply({ content: 'Escolha o método de pagamento:', components: [row], ephemeral: true });
            }
            else if (i.customId === 'pix') {
                const vbucksButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('vbucks')
                    .setLabel('V-Bucks')
                    .setStyle(discord_js_1.ButtonStyle.Primary);
                const skinsButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('skins')
                    .setLabel('Skins')
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const row = new discord_js_1.ActionRowBuilder().addComponents(vbucksButton, skinsButton);
                await i.reply({ content: 'Escolha o produto:', components: [row], ephemeral: true });
            }
            else if (i.customId === 'vbucks' || i.customId === 'skins') {
                const channelName = `${i.customId}-${i.user.username}-pedido`;
                const guild = i.guild;
                if (guild) {
                    const createdChannel = await guild.channels.create({
                        name: channelName,
                        type: discord_js_1.ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: i.user.id,
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                            },
                            {
                                id: guild.roles.everyone,
                                deny: ['ViewChannel'],
                            },
                        ],
                    });
                    await createdChannel.send({ embeds: [newChannelEmbed] });
                    await i.reply({ content: `Ticket criado com sucesso! ${createdChannel}`, ephemeral: true });
                }
            }
        });
    },
});
