/**
 * تنظيف النص العربي قبل المقارنة.
 *
 * يدعم:
 * - إزالة التشكيل
 * - توحيد أ / إ / آ -> ا
 * - توحيد ة -> ه
 * - توحيد ى -> ي
 * - إزالة التطويل
 * - إزالة المسافات والرموز
 * - تحويل الأحرف إلى lowercase
 * - توحيد بعض أشكال الهمزة
 */
export function normalizeArabic(text: unknown): string {
  if (text === null || text === undefined) {
    return "";
  }

  return String(text)
    .normalize("NFKC")
    .toLocaleLowerCase("ar")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[٠-٩]/g, (char) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(char))
    )
    .replace(/[^\p{L}\p{N}]/gu, "");
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
      (answer) => user === normalizeArabic(answer)
    );
  }

  return user === normalizeArabic(correctAnswer);
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

  if (Array.isArray(answerValue)) {
    return answerValue.map(normalizeArabic);
  }

  if (gameType === "flags" && flagAnswerMap) {
    return (flagAnswerMap[answerValue] ?? [answerValue]).map(
      normalizeArabic
    );
  }

  if (Array.isArray(answerValue)) {
    return answerValue.map(normalizeArabic);
  }

  return [normalizeArabic(answerValue)];
}
