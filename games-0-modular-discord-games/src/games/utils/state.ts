/**
 * حالة الجولة في القناة.
 */
interface RoundState {
  game: string;
  startedAt: number;
}

/**
 * مدير حالة الألعاب.
 * يمنع تشغيل أكثر من لعبة في نفس القناة في نفس الوقت.
 */
class GameStateManager {
  private activeRounds = new Map<string, RoundState>();

  /**
   * بدء جولة جديدة في القناة.
   * يرجع true إذا تمت البداية بنجاح، false إذا كانت هناك جولة جارية بالفعل.
   */
  startRound(channelId: string, gameId: string): boolean {
    if (this.activeRounds.has(channelId)) {
      return false;
    }

    this.activeRounds.set(channelId, {
      game: gameId,
      startedAt: Date.now(),
    });

    return true;
  }

  /**
   * إنهاء الجولة في القناة.
   */
  endRound(channelId: string): void {
    this.activeRounds.delete(channelId);
  }

  /**
   * الحصول على الجولة النشطة.
   */
  getActiveRound(channelId: string): RoundState | undefined {
    return this.activeRounds.get(channelId);
  }

  /**
   * التحقق من وجود جولة نشطة.
   */
  hasActiveRound(channelId: string): boolean {
    return this.activeRounds.has(channelId);
  }

  /**
   * مسح جميع الجولات (للاختبار).
   */
  clear(): void {
    this.activeRounds.clear();
  }
}

export const gameStateManager = new GameStateManager();
