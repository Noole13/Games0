import { getFirebaseDatabase } from "./firebase";

export type ScoreEvent = {
  game: string;
  userId: string;
  username: string;
  points: number;
  detail?: string;
};

export async function recordScore(event: ScoreEvent): Promise<void> {
  const db = getFirebaseDatabase();
  const userRef = db.ref(`players/${event.userId}`);
  const gameRef = db.ref(`leaderboards/${event.game}/${event.userId}`);
  const historyRef = db.ref("scoreHistory").push();
  const now = new Date().toISOString();

  const current = (await userRef.get()).val() as
    | { totalPoints?: number; gamesPlayed?: number; username?: string }
    | null;

  const nextTotal = (current?.totalPoints ?? 0) + event.points;
  const nextGames = (current?.gamesPlayed ?? 0) + 1;
  const gameScore = (await gameRef.get()).val() as
    | { points?: number; gamesPlayed?: number; username?: string }
    | null;

  await db.ref().update({
    [`players/${event.userId}`]: {
      username: event.username,
      totalPoints: nextTotal,
      gamesPlayed: nextGames,
      updatedAt: now,
    },
    [`leaderboards/${event.game}/${event.userId}`]: {
      username: event.username,
      points: (gameScore?.points ?? 0) + event.points,
      gamesPlayed: (gameScore?.gamesPlayed ?? 0) + 1,
      updatedAt: now,
    },
    [`scoreHistory/${historyRef.key}`]: {
      ...event,
      createdAt: now,
    },
  });
}

export async function getLeaderboard(
  game = "all",
  limit = 10,
): Promise<Array<{ userId: string; username: string; points: number }>> {
  const db = getFirebaseDatabase();
  const snapshot = await db.ref(game === "all" ? "players" : `leaderboards/${game}`).get();
  const values = snapshot.val() as Record<
    string,
    { username?: string; totalPoints?: number; points?: number }
  > | null;

  return Object.entries(values ?? {})
    .map(([userId, value]) => ({
      userId,
      username: value.username ?? "لاعب",
      points: value.points ?? value.totalPoints ?? 0,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export async function saveCountingRecord(
  userId: string,
  username: string,
  streak: number,
  record: number,
): Promise<void> {
  const db = getFirebaseDatabase();
  await db.ref(`counting/${userId}`).update({
    username,
    streak,
    record,
    updatedAt: new Date().toISOString(),
  });
}