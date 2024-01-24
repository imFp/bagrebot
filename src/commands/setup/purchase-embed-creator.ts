import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, ColorResolvable, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../structs/types/Command";
import { config } from "../..";

const purchaseChannel = "1180567148943376534";
const productsChannel = "1180567096149672057";
const feedbackChannel = "1180567360332124160";

export default new Command({
    name: "purchase-embed",
    description: "Criar embed de compras",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    async run({ interaction, options }) {
        const selectedOption = options.getString("default") as string;
        const targetChannel = await interaction.client.channels.fetch(purchaseChannel); 

        const tutorialEmbed = new EmbedBuilder()
            .setTitle("🛒 Como Comprar")
            .setDescription(`Para efetuar uma compra em nossa loja, siga os passos abaixo:
            
            Primeiro, vá ao canal de produtos: <#${productsChannel}> e escolha o produto que deseja comprar.
            
            Após isso, nesse mesmo canal, selecione o produto desejado. Quando selecionar, escolha o método de pagamento que deseja utilizar.
            Após isso, um ticket será criado, basta seguir as etapas enviadas no ticket.

            Para checar o feedback de compradores passados, vá ao canal <#${feedbackChannel}>.`)
            .setColor(config.colors["green-dark"] as ColorResolvable)
            .setImage("https://media.discordapp.net/attachments/1180572591111544942/1181659773863727124/New_Project.png")
            .setFooter({
                text: "© 2023-2024 by Bagre Store",
                iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png",
            })
            .setTimestamp();

        const comprarButton = new ButtonBuilder()
            .setCustomId('comprar')
            .setLabel('Comprar')
            .setStyle(ButtonStyle.Primary);
      
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(comprarButton);
      
        if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({
                embeds: [tutorialEmbed],
                components: [row]
            });
        } 

        const newChannelEmbed = new EmbedBuilder()
            .setTitle("🛒 Compra")
            .setDescription(`Olá! Muito obrigado por criar um ticket conosco para efetuar uma compra!
            Espere um carregador de V-Bucks entrar em contato com você.

            Para facilitar o processo, siga o formulário abaixo:
            Email da conta:
            Senha da conta:
            Possui ADF:
            Quantidade de skins/vbucks:
            Plataforma que joga:`)
            .setColor(config.colors["green-dark"] as ColorResolvable)
            .setImage("https://media.discordapp.net/attachments/1180572591111544942/1181659773863727124/New_Project.png")
            .setFooter({
                text: "© 2023-2024 by Bagre Store",
                iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png",
            })
            .setTimestamp();

        const filter = (i: any) => {
            return ['comprar', 'pix', 'vbucks', 'skins'].includes(i.customId) && i.user.id === interaction.user.id;
        };
        if(!interaction.channel) { return; }
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async (i: any) => {
            if (i.customId === 'comprar') {
                const pixButton = new ButtonBuilder()
                    .setCustomId('pix')
                    .setLabel('Pix')
                    .setStyle(ButtonStyle.Success);
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(pixButton);
                await i.reply({ content: 'Escolha o método de pagamento:', components: [row], ephemeral: true });
            } else if (i.customId === 'pix') {
                const vbucksButton = new ButtonBuilder()
                    .setCustomId('vbucks')
                    .setLabel('V-Bucks')
                    .setStyle(ButtonStyle.Primary);
                const skinsButton = new ButtonBuilder()
                    .setCustomId('skins')
                    .setLabel('Skins')
                    .setStyle(ButtonStyle.Danger);
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(vbucksButton, skinsButton);
                await i.reply({ content: 'Escolha o produto:', components: [row], ephemeral: true });
            } else if (i.customId === 'vbucks' || i.customId === 'skins') {
                const channelName = `${i.customId}-${i.user.username}-pedido`;
                const guild = i.guild;
                if (guild) {
                    const createdChannel = await guild.channels.create({
                        name: channelName,
                        type: ChannelType.GuildText,
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
