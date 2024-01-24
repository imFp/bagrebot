import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, ColorResolvable, EmbedBuilder, ModalBuilder, PermissionFlagsBits, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../../structs/types/Command";
import { config } from "../..";

export default new Command({
    name: "anunciar",
    description: "Fazer um anúncio.",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    async run({ interaction}) {
        const announcementModal = new ModalBuilder({
            customId: "announcement-modal",
            title: "Anúncio"
        });

        const titleInput = new ActionRowBuilder<TextInputBuilder>({components: [
            new TextInputBuilder({
                customId: "announcement-modal-title",
                label: "Título",
                placeholder: "Título do anúncio",
                style: TextInputStyle.Short,
                max_length: 75,
                required: true,
            })
        ]})

        const descriptionInput = new ActionRowBuilder<TextInputBuilder>({components: [
            new TextInputBuilder({
                customId: "announcement-modal-description",
                label: "Descrição",
                placeholder: "Elabore o assunto",
                style: TextInputStyle.Paragraph,
                max_length: 3000,
                required: true,
            })
        ]})

        const imageInput = new ActionRowBuilder<TextInputBuilder>({components: [
            new TextInputBuilder({
                customId: "announcement-modal-image",
                label: "Imagem",
                placeholder: "Imagem junto ao anúncio (opcional)",
                style: TextInputStyle.Short,
                required: false,
                max_length: 3000,
            })
        ]})

        announcementModal.setComponents(titleInput, descriptionInput, imageInput);

        interaction.showModal(announcementModal);

        const modalInteraction = await interaction.awaitModalSubmit({time: 6000_000, filter: (i) => i.user.id == interaction.user.id}).catch(() => null)
        if(!modalInteraction) return;

        const { fields } = modalInteraction
        const title = fields.getTextInputValue("announcement-modal-title");
        const description = fields.getTextInputValue("announcement-modal-description");
        const image = fields.getTextInputValue("announcement-modal-image") || "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png?format=webp&quality=lossless&width=682&height=682"; 

        const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(config.colors["red-dark"] as ColorResolvable)
        .setImage(image)
        .setFooter({
            text: "© 2023-2024 by Bagre Store",
            iconURL: "https://images-ext-2.discordapp.net/external/K5eVbLP9JEXYqYJ6ayMagIEcJAm8UFNMU1ipHxm7rlw/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1180563430445420685/51f616b8d5724667dc755b517ee66a0d.png?format=webp&quality=lossless&width=682&height=682",
        })
        .setTimestamp()

        await modalInteraction.reply({embeds: [embed]});
    }
})