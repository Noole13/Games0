/**
 * تنظيف النص العربي قبل المقارنة.
 */
export function normalizeArabic(text: unknown): string {
  if (text === null || text === undefined) {
    return "";
  }

  return String(text)
    .trim()
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // إزالة التشكيل والتطويل
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[٠-٩]/g, (char) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(char))
    )
    .replace(/\s+/g, " "); // توحيد المسافات
}

/**
 * مقارنة إجابة عضو مع إجابة صحيحة.
 */
export function isCorrectAnswer(
  userAnswer: string,
  correctAnswer: string | string[]
): boolean {
  const user = normalizeArabic(userAnswer);

  if (!user) {
    return false;
  }

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(
      (answer) => user === answer || user === normalizeArabic(answer)
    );
  }

  return user === correctAnswer || user === normalizeArabic(correctAnswer);
}

/**
 * الحصول على جميع الإجابات المقبولة للسؤال.
 */
export function getAllAcceptedAnswers(
  answer: string | string[] | undefined,
  gameType: string,
  flagAnswerMap?: Record<string, string[]>
): string[] {
  const answerValue = answer ?? "";

  let rawAnswers: string[] = [];

  if (Array.isArray(answerValue)) {
    rawAnswers = answerValue;
  } else if (gameType === "flags" && flagAnswerMap && flagAnswerMap[answerValue]) {
    rawAnswers = flagAnswerMap[answerValue];
  } else {
    rawAnswers = [String(answerValue)];
  }

  // إرجاع الإجابات مطبعة وجاهزة للمقارنة المباشرة
  return rawAnswers.map(normalizeArabic);
}
