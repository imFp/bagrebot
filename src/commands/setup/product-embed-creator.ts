import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, ColorResolvable, EmbedBuilder, ModalBuilder, PermissionFlagsBits, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../../structs/types/Command";
import { config } from "../..";

const purchaseChannel = "1180567096149672057";
const productsChannel = "1180567148943376534";

export default new Command({
    name: "embed-creator",
    description: "Criar embeds",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "embed",
            description: "Selecionar qual embed você quer enviar",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Produto: V-Bucks",
                    value: "product-vbucks"
                },
                {
                    name: "Produto: Skin",
                    value: "product-skin"
                },
            ]
        }
    ],

    async run({interaction, options}) {
        const selectedOption = options.getString("embed") as string;

        const embedDetails: {[key: string]: { title: string, description: string, image: string, color: string }} = {
            'product-vbucks': {
                title: "Produto da Loja - V-Bucks",
                description: `Olá! Seja bem-vindo à nosso setor de produtos. \n
                Aqui está a tabela de preços para os v-bucks de Fortnite:
                3.500 V-Bucks: R$ 130,00
                5.000 V-Bucks: R$ 65,00
                2.800 V-Bucks: R$ 35,00
                1.000 V-Bucks: R$ 18,00
                \n Para comprar, crie um ticket de compra no canal: <#${purchaseChannel}>`,
                image: "https://images-ext-1.discordapp.net/external/clAafIyM0HiKQgFvX8BakCDGEtZpkv0L30S6OySSBXE/%3Fformat%3Dwebp%26width%3D431%26height%3D242/https/images-ext-2.discordapp.net/external/Dqz05P7RMznd-QCe9dDTHQ-h2vdI0hwT3EsQhqDSoFQ/%253Fq%253D90%2526w%253D480%2526h%253D270/https/store-images.s-microsoft.com/image/apps.11159.71999796408230842.d5b102d1-59c5-43a9-a0a7-791f1ac92271.f1502064-c283-41af-afac-644102e73fd7?format=webp&width=387&height=217",
                color: config.colors["cyan-light"]
            },
            'product-skin': {
                title: "Produto da Loja - Skins",
                description: `Aqui está a tabela de preços para as skins de Fortnite: \n
                Skin de 2.000 V-Bucks: R$ 26,00
                Skin de 1.500 V-Bucks: R$ 19,00
                Skin de 1.200 V-Bucks: R$ 17,00
                Skin de 800 V-Bucks: R$ 12,00 \n
                Para comprar skins separadas, adicione a conta **BagreStore** no Fortnite.
                As contas devem ter amizade por pelo menos 48 horas para podermos enviar a skin desejada como presente.
                \n Para comprar, crie um ticket de compra no canal: <#${purchaseChannel}>`,
                image: "https://cdn.discordapp.com/attachments/1180572591111544942/1193183329638436884/recon-expert-skin.webp?ex=65be3e92&is=65abc992&hm=f4817c87f8adc06afed04720a337b1264fde9a551383e3ee34d844221e91ae9f&",
                color: config.colors["cyan-light"]
            }
        };
        if(embedDetails[selectedOption]) {
            const details = embedDetails[selectedOption];

            const embed = new EmbedBuilder()
            .setTitle(details.title)
            .setDescription(details.description)
            .setColor(details.color as ColorResolvable)
            .setImage(details.image)
            .setFooter({
                text: "© 2023-2024 by Bagre Store",
                iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png?format=webp&quality=lossless&width=682&height=682",
            })
            .setTimestamp();

            const targetChannel = await interaction.client.channels.fetch(productsChannel);

            if(targetChannel && targetChannel.isTextBased()) {
                await (targetChannel as TextChannel).send({ embeds: [embed] });
            }

            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply();
        } else {
            await interaction.reply({ content: 'Invalid choice selected.', ephemeral: true });
        }
    },
})  