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
import {
  COLORS,
  waitForChannelMessage,
  getUserInfo,
  showContinuationButtons,
} from "./utils/helpers";
import { recordScore } from "../lib/leaderboard";
import { logger } from "../lib/logger";

const FLAG_ANSWER_MAP: Record<string, string[]> = {
  السعودية: [
    "السعودية",
    "السعوديه",
    "المملكة العربية السعودية",
    "المملكه العربيه السعوديه",
  ],
  اليابان: ["اليابان"],
  البرازيل: ["البرازيل"],
  فرنسا: ["فرنسا"],
  الإمارات: [
    "الإمارات",
    "الامارات",
    "الإمارات العربية المتحدة",
    "الامارات العربيه المتحده",
  ],
  الكويت: ["الكويت"],
  قطر: ["قطر"],
  البحرين: ["البحرين"],
  عمان: ["عمان", "سلطنة عمان", "سلطنه عمان"],
  مصر: ["مصر"],
  الأردن: ["الأردن", "الاردن"],
  لبنان: ["لبنان"],
  سوريا: ["سوريا"],
  العراق: ["العراق"],
  اليمن: ["اليمن"],
  المغرب: ["المغرب"],
  الجزائر: ["الجزائر"],
  تونس: ["تونس"],
  ليبيا: ["ليبيا"],
  السودان: ["السودان"],
  أمريكا: ["أمريكا", "امريكا", "الولايات المتحدة", "الولايات المتحده"],
  بريطانيا: [
    "بريطانيا",
    "المملكة المتحدة",
    "المملكه المتحده",
    "إنجلترا",
    "انجلترا",
  ],
  ألمانيا: ["ألمانيا", "المانيا"],
  إيطاليا: ["إيطاليا", "ايطاليا"],
  إسبانيا: ["إسبانيا", "اسبانيا"],
  تركيا: ["تركيا"],
  "كوريا الجنوبية": ["كوريا الجنوبية", "كوريا الجنوبيه"],
  الصين: ["الصين"],
  الهند: ["الهند"],
  الأرجنتين: ["الأرجنتين", "الارجنتين"],
  كندا: ["كندا"],
  أستراليا: ["أستراليا", "استراليا"],
};

function pickQuestion(): ChoiceQuestion | undefined {
  return flagQuestions[Math.floor(Math.random() * flagQuestions.length)];
}

function createQuestionEmbed(question: ChoiceQuestion, seconds: number) {
  const acceptedAnswers = getAllAcceptedAnswers(
    question.answer,
    "flags",
    FLAG_ANSWER_MAP
  );

  return new EmbedBuilder()
    .setColor(COLORS.BRAND)
    .setTitle("تخمين الأعلام")
    .setDescription(
      `${question.prompt}\n\nاكتب اسم الدولة في القناة.\n\n` +
        `لديك **${seconds} ثوانٍ**، وأول إجابة صحيحة تفوز.`
    )
    .addFields({
      name: "النقاط",
      value: String(question.points ?? 10),
      inline: true,
    })
    .setFooter({
      text: "3RB Games • اكتب إجابتك في القناة",
    })
    .setImage(question.image ?? "")
    .setFooter({
      text: `3RB Games • ${acceptedAnswers.length} صيغة إجابة مقبولة`,
    });
}

/**
 * تشغيل جولة الأعلام.
 * المستمع محصور في القناة الحالية ويُهمل رسائل البوت،
 * مع تطبيع الإجابة العربية قبل المقارنة.
 */
export async function runFlagsGame(
  interaction: StringSelectMenuInteraction
): Promise<void> {
  const question = pickQuestion();
  const seconds = 30;

  if (!question) {
    await interaction.update({
      content: "لا توجد أسئلة أعلام متاحة حالياً.",
      embeds: [],
      components: [],
    });
    return;
  }

  // تحديث رسالة القائمة فوراً وعرض السؤال دون أي تأخير مع جلب كائن الرسالة
  const roundMessage = await interaction.update({
    embeds: [createQuestionEmbed(question, seconds)],
    components: [],
    fetchReply: true,
  });

  const acceptedAnswers = getAllAcceptedAnswers(
    question.answer,
    "flags",
    FLAG_ANSWER_MAP
  );

  const winner = await waitForChannelMessage(
    roundMessage.channel,
    (message: Message) => {
      if (message.author.bot) {
        return false;
      }

      if (message.channelId !== interaction.channelId) {
        return false;
      }

      return isCorrectAnswer(message.content, acceptedAnswers);
    },
    seconds * 1000
  );

  if (!winner) {
    const timeoutEmbed = new EmbedBuilder()
      .setColor(COLORS.ERROR)
      .setTitle("انتهى الوقت")
      .setDescription(
        `لم يجب أحد خلال **${seconds} ثوانٍ**.\nالإجابة الصحيحة كانت: **${question.answer}**`
      );

    if (question.image) {
      timeoutEmbed.setThumbnail(question.image);
    }

    await showContinuationButtons(interaction, timeoutEmbed);
    return;
  }

  const user = getUserInfo(winner);
  const points = question.points ?? 10;

  try {
    await recordScore({
      game: "flags",
      userId: user.id,
      username: user.name,
      points,
      detail: "إجابة صحيحة في لعبة الأعلام",
    });
  } catch (error) {
    logger.error({ error, userId: user.id }, "Failed to record flags score");
  }

  const successEmbed = new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle("إجابة صحيحة")
    .setDescription(
      `أجاب <@${winner.author.id}> بشكل صحيح وحصل على **${points} نقطة**.\nالإجابة: **${question.answer}**`
    );

  if (question.image) {
    successEmbed.setThumbnail(question.image);
  }

  await showContinuationButtons(interaction, successEmbed);
}

export { FLAG_ANSWER_MAP };

const flagsGame = {
  id: "flags",
  run: runFlagsGame,
};

export default flagsGame;
