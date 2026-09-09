export type GameId =
  | "flags"
  | "chairs"
  | "jokes"
  | "words"
  | "crowd"
  | "celebrities"
  | "brands"
  | "roulette"
  | "hide-seek"
  | "quick"
  | "scramble"
  | "letter-catch"
  | "counting"
  | "truth-dare"
  | "duel";

export type GameDefinition = {
  id: GameId;
  label: string;
  description: string;
};

export const games: GameDefinition[] = [
  {
    id: "flags",
    label: "تخمين الأعلام",
    description:
      "اكتب اسم الدولة من العلم قبل انتهاء الوقت",
  },
  {
    id: "chairs",
    label: "الكراسي",
    description:
      "اضغط بسرعة قبل سحب الكراسي",
  },
  {
    id: "jokes",
    label: "فكاهة",
    description:
      "أسئلة خفيفة ومواقف مضحكة",
  },
  {
    id: "words",
    label: "تجميع الكلمات",
    description:
      "كوّن كلمة من الحروف المعروضة",
  },
  {
    id: "crowd",
    label: "تصحيح الجموع",
    description:
      "اختر الجمع الصحيح للكلمة",
  },
  {
    id: "celebrities",
    label: "المشاهير",
    description:
      "خمن الشخصية من التلميح",
  },
  {
    id: "brands",
    label: "الماركات",
    description:
      "تعرف على العلامة من تلميحها",
  },
  {
    id: "roulette",
    label: "عجلة الروليت",
    description:
      "أدخل أسماء المشاركين واختر فائزاً عشوائياً",
  },
  {
    id: "hide-seek",
    label: "غميضة",
    description:
      "اختر مكان اختبائك ولا تدع الباحث يجدك",
  },
  {
    id: "quick",
    label: "التحدي السريع",
    description:
      "رياضيات وسرعة كتابة ضد الوقت",
  },
  {
    id: "scramble",
    label: "تركيب الحروف",
    description:
      "رتب الحروف لتكتشف الكلمة",
  },
  {
    id: "letter-catch",
    label: "صيد الحرف",
    description:
      "اكتب كلمة تبدأ بالحرف المطلوب",
  },
  {
    id: "counting",
    label: "عُد حتى الرقم",
    description:
      "حافظ على الستريك وسجل رقمك القياسي",
  },
  {
    id: "truth-dare",
    label: "صراحة أم جرأة",
    description:
      "اختر صراحة أو جرأة",
  },
  {
    id: "duel",
    label: "مبارزة 1 ضد 1",
    description:
      "تحدّ لاعباً في جولة سريعة",
  },
];

export function gameById(
  id: string,
): GameDefinition | undefined {
  return games.find((game) => game.id === id);
}
