import {
  EmbedBuilder,
  type Message,
  type StringSelectMenuInteraction,
} from "discord.js";
import { flagQuestions, type ChoiceQuestion } from "./data";
import {
  getAllAcceptedAnswers,
  isCorrectAnswer,
} from "./utils/normalizer";
import { COLORS, showContinuationButtons } from "./utils/helpers";
import { recordScore } from "../lib/leaderboard";
import { logger } from "../lib/logger";

const FLAG_ANSWER_MAP: Record<string, string[]> = {
  العراق: ["العراق"],
  الجزائر: ["الجزائر"],
  سوريا: ["سوريا"],
  اليمن: ["اليمن"],
  لبنان: ["لبنان"],
  تركيا: ["تركيا"],
  مصر: ["مصر"],
  الإمارات: ["الإمارات", "الامارات"],
  الصين: ["الصين"],
  فرنسا: ["فرنسا"],
  المانيا: ["ألمانيا", "المانيا"],
  روسيا: ["روسيا"],
  اليابان: ["اليابان"],
  البرتغال: ["البرتغال"],
  كرواتيا: ["كرواتيا"],
  فيتنام: ["فيتنام"],
  تايوان: ["تايوان"],
  إيطاليا: ["إيطاليا", "ايطاليا"],
  السعودية: ["السعودية", "السعوديه", "المملكة العربية السعودية"],
};

function pickQuestion(): ChoiceQuestion | undefined {
  return flagQuestions[Math.floor(Math.random() * flagQuestions.length)];
}

export async function runFlagsGame(
  interaction: StringSelectMenuInteraction
): Promise<void> {
  const question = pickQuestion();
  const seconds = 15;

  if (!question) {
    await interaction.update({
      content: "لا توجد أسئلة أعلام متاحة حالياً.",
      embeds: [],
      components: [],
    });
    return;
  }

  const acceptedAnswers = getAllAcceptedAnswers(
    question.answer,
    "flags",
    FLAG_ANSWER_MAP
  );

  const embed = new EmbedBuilder()
    .setColor(COLORS.BRAND)
    .setTitle("تخمين الأعلام")
    .setDescription(
      `أي دولة تحمل هذا العلم؟\n\nاكتب اسم الدولة في القناة.\n\nلديك **${seconds} ثوانٍ**، وأول إجابة صحيحة تفوز.`
    )
    .addFields({
      name: "النقاط",
      value: String(question.points ?? 10),
      inline: true,
    })
    .setImage(question.image ?? "")
    .setFooter({
      text: "3RB Games",
    });

  await interaction.update({
    embeds: [embed],
    components: [],
  });

  const channel = interaction.channel;
  if (!channel || !("createMessageCollector" in channel)) {
    return;
  }

  // استخدام طريقة Collector مباشرة وبسيطة مثل الكود القديم
  const collector = channel.createMessageCollector({
    filter: (m: Message) => !m.author.bot && isCorrectAnswer(m.content, acceptedAnswers),
    time: seconds * 1000,
    max: 1,
  });

  collector.on("collect", async (msg: Message) => {
    const points = question.points ?? 10;
    const userId = msg.author.id;
    const username = msg.author.globalName ?? msg.author.username;

    try {
      await recordScore({
        game: "flags",
        userId,
        username,
        points,
        detail: "إجابة صحيحة في لعبة الأعلام",
      });
    } catch (error) {
      logger.error({ error }, "Failed to record score");
    }

    const successEmbed = new EmbedBuilder()
      .setColor(COLORS.SUCCESS)
      .setTitle("إجابة صحيحة")
      .setDescription(`✅ | <@${userId}> الإجابة صحيحة وحصل على **${points} نقطة**!\nالإجابة: **${question.answer}**`);

    if (question.image) {
      successEmbed.setThumbnail(question.image);
    }

    await showContinuationButtons(interaction, successEmbed);
  });

  collector.on("end", async (collected) => {
    if (collected.size === 0) {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(COLORS.ERROR)
        .setTitle("انتهى الوقت")
        .setDescription(`🕘 | انتهى الوقت ولم يقم أحد بالإجابة الصحيحة.\nالإجابة كانت: **${question.answer}**`);

      if (question.image) {
        timeoutEmbed.setThumbnail(question.image);
      }

      await showContinuationButtons(interaction, timeoutEmbed);
    }
  });
}

const flagsGame = {
  id: "flags",
  run: runFlagsGame,
};

export default flagsGame;
