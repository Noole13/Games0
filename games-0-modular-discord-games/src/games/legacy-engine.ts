// @ts-nocheck

import {
  ActionRowBuilder as T,
  ButtonBuilder as h,
  ButtonStyle as w,
  EmbedBuilder as i,
  StringSelectMenuBuilder as P,
  StringSelectMenuOptionBuilder as L,
} from "discord.js";

import { gameById as j } from "./catalog";

import {
  brandQuestions as W,
  crowdQuestions as U,
  darePrompts as V,
  flagQuestions as H,
  hideSpots as J,
  peopleQuestions as K,
  truthPrompts as q,
  wordRounds as X,
} from "./data";

import {
  recordScore as Y,
  saveCountingRecord as Z,
} from "../lib/leaderboard";

import { logger as ee } from "../lib/logger";

const D = new Map();
const R = new Map();

const m = 2672550;
const d = 16234837;
const y = 6153098;

const te = 30000;

/**
 * إجابات الدول المقبولة.
 *
 * المفتاح هو الإجابة الأساسية الموجودة في البيانات،
 * والقيمة تحتوي على الصيغ الأخرى المقبولة.
 */
const se = {
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

  عمان: [
    "عمان",
    "سلطنة عمان",
    "سلطنه عمان",
  ],

  مصر: ["مصر"],

  الأردن: [
    "الأردن",
    "الاردن",
  ],

  لبنان: ["لبنان"],

  سوريا: ["سوريا"],

  العراق: ["العراق"],

  اليمن: ["اليمن"],

  المغرب: ["المغرب"],

  الجزائر: ["الجزائر"],

  تونس: ["تونس"],

  ليبيا: ["ليبيا"],

  السودان: ["السودان"],

  أمريكا: [
    "أمريكا",
    "امريكا",
    "الولايات المتحدة",
    "الولايات المتحده",
  ],

  بريطانيا: [
    "بريطانيا",
    "المملكة المتحدة",
    "المملكه المتحده",
    "إنجلترا",
    "انجلترا",
  ],

  ألمانيا: [
    "ألمانيا",
    "المانيا",
  ],

  إيطاليا: [
    "إيطاليا",
    "ايطاليا",
  ],

  إسبانيا: [
    "إسبانيا",
    "اسبانيا",
  ],

  تركيا: ["تركيا"],

  "كوريا الجنوبية": [
    "كوريا الجنوبية",
    "كوريا الجنوبيه",
  ],

  الصين: ["الصين"],

  الهند: ["الهند"],

  الأرجنتين: [
    "الأرجنتين",
    "الارجنتين",
  ],

  كندا: ["كندا"],

  أستراليا: [
    "أستراليا",
    "استراليا",
  ],
};

/**
 * تقصير النص حتى لا يتجاوز حدود Discord.
 */
function _(e) {
  return e.length > 100
    ? `${e.slice(0, 97)}...`
    : e;
}

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
function A(e) {
  if (e === null || e === undefined) {
    return "";
  }

  return String(e)
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
 *
 * يمكن تمرير:
 * - إجابة واحدة
 * - مصفوفة إجابات
 */
function isCorrectAnswer(userAnswer, correctAnswer) {
  const user = A(userAnswer);

  if (!user) {
    return false;
  }

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(
      (answer) => user === A(answer)
    );
  }

  return user === A(correctAnswer);
}

/**
 * الحصول على جميع الإجابات المقبولة للسؤال.
 */
function ne(e, t) {
  const answer = e?.answer ?? "";

  if (t === "flags") {
    return (
      se[answer] ?? [answer]
    ).map(A);
  }

  if (Array.isArray(answer)) {
    return answer.map(A);
  }

  return [A(answer)];
}

/**
 * Select Menu.
 */
function oe(e, t) {
  const o = t ?? [];

  const s = new P()
    .setCustomId(e)
    .setPlaceholder("اختر إجابتك")
    .addOptions(
      o.map(
        (n, a) =>
          new L()
            .setLabel(_(n ?? ""))
            .setValue(String(a))
      )
    );

  return new T().addComponents(s);
}

/**
 * Action Row.
 */
function C(e) {
  return new T().addComponents(e);
}

/**
 * Embed السؤال.
 */
function ae(e, t, o) {
  const s = new i()
    .setColor(m)
    .setTitle(e)
    .setDescription(t.prompt)
    .addFields(
      {
        name: "الوقت",
        value: `${o} ثانية`,
        inline: true,
      },
      {
        name: "النقاط",
        value: `${t.points ?? 10}`,
        inline: true,
      }
    )
    .setFooter({
      text: "3RB Games • اكتب إجابتك في القناة • أول إجابة صحيحة تفوز",
    });

  if (t.image) {
    s.setImage(t.image);
  }

  return s;
}

/**
 * معلومات المستخدم من Interaction أو Message.
 */
function G(e) {
  return "user" in e
    ? {
        id: e.user.id,
        name:
          e.user.globalName ??
          e.user.username,
      }
    : {
        id: e.author.id,
        name:
          e.author.globalName ??
          e.author.username,
      };
}

/**
 * اسم المستخدم.
 */
function S(e) {
  return G(e).name;
}

/**
 * التأكد أن العنصر Channel يدعم awaitMessages.
 */
function re(e) {
  if (
    typeof e === "object" &&
    e !== null &&
    "awaitMessages" in e &&
    typeof e.awaitMessages === "function"
  ) {
    return e;
  }

  return undefined;
}

/**
 * انتظار رسالة من القناة.
 */
async function b(e, t, o) {
  const s = re(e);

  if (!s) {
    return undefined;
  }

  try {
    const messages = await s.awaitMessages({
      filter: t,
      max: 1,
      time: o,
    });

    return messages.first();
  } catch {
    return undefined;
  }
}

/**
 * تسجيل نقاط اللاعب.
 */
async function f(e, t, o, s, n) {
  const user = G(e);

  await k(
    user.id,
    user.name,
    t,
    o,
    s,
    n
  );
}

/**
 * حفظ النقاط.
 */
async function k(
  e,
  t,
  o,
  s,
  n
) {
  try {
    await Y({
      game: o,
      userId: e,
      username: t,
      points: s,
      detail: n,
    });
  } catch (a) {
    ee.error(
      {
        error: a,
        game: o,
        userId: e,
      },
      "Failed to record game score"
    );
  }
}

/**
 * منع تشغيل أكثر من لعبة في نفس القناة.
 */
function ie(e, t) {
  if (D.has(e)) {
    return false;
  }

  D.set(e, {
    game: t,
    startedAt: Date.now(),
  });

  return true;
}

/**
 * إنهاء اللعبة في القناة.
 */
function ce(e) {
  D.delete(e);
}

/**
 * إظهار قائمة الألعاب.
 */
async function Te(e) {
  await e.reply({
    embeds: [v()],
    components: [z()],
  });
}

/**
 * Embed قائمة الألعاب.
 */
function v() {
  return new i()
    .setColor(m)
    .setTitle("3RB Games")
    .setDescription(
      "اختر لعبة من القائمة وابدأ جولة جديدة مع الموجودين في القناة."
    );
}

/**
 * قائمة الألعاب.
 */
function z() {
  const e = [
    "flags",
    "chairs",
    "jokes",
    "words",
    "crowd",
    "celebrities",
    "brands",
    "roulette",
    "hide-seek",
    "quick",
    "scramble",
    "letter-catch",
    "counting",
    "truth-dare",
    "duel",
  ];

  const t = new P()
    .setCustomId("game-picker")
    .setPlaceholder("اختر لعبة للبدء")
    .addOptions(
      e.map((o) => {
        const s = j(o);

        return new L()
          .setLabel(s?.label ?? o)
          .setDescription(
            s?.description ?? "لعبة ممتعة"
          )
          .setValue(o);
      })
    );

  return new T().addComponents(t);
}

/**
 * اختيار اللعبة.
 */
async function De(e) {
  const t = e.values[0];
  const o = j(t);

  if (!o) {
    await e.update({
      content: "اللعبة غير متاحة حالياً.",
      embeds: [],
      components: [],
    });

    return;
  }

  const s = e.channelId;

  if (!ie(s, t)) {
    await e.update({
      content:
        "هناك جولة جارية في هذه القناة. انتظر انتهائها ثم ابدأ جولة جديدة.",
      embeds: [],
      components: [],
    });

    return;
  }

  await e.update({
    embeds: [
      new i()
        .setColor(m)
        .setTitle(o.label)
        .setDescription("جاري تجهيز الجولة..."),
    ],
    components: [],
  });

  try {
    switch (t) {
      case "flags":
        await I(
          e,
          "تخمين الأعلام",
          H,
          t,
          10
        );
        break;

      case "crowd":
        await I(
          e,
          "تصحيح الجموع",
          U,
          t,
          15
        );
        break;

      case "celebrities":
        await I(
          e,
          "المشاهير",
          K,
          t,
          15
        );
        break;

      case "brands":
        await I(
          e,
          "الماركات",
          W,
          t,
          15
        );
        break;

      case "jokes":
        await le(e);
        break;

      case "words":
      case "scramble":
        await de(e, t);
        break;

      case "roulette":
        await me(e);
        break;

      case "hide-seek":
        await ue(e);
        break;

      case "quick":
        await pe(e);
        break;

      case "letter-catch":
        await we(e);
        break;

      case "counting":
        await ge(e);
        break;

      case "truth-dare":
        await he(e);
        break;

      case "chairs":
        await ye(e);
        break;

      case "duel":
        await be(e);
        break;
    }
  } finally {
    ce(s);
  }
}

/**
 * ألعاب الأسئلة والإجابات.
 *
 * تم تحسين قراءة الإجابة هنا بحيث:
 * - يتم تنظيف إجابة العضو
 * - إزالة التشكيل
 * - توحيد الحروف العربية
 * - دعم أكثر من صيغة للإجابة
 */
async function I(e, t, o, s, n) {
  const a = o ?? [];

  const r =
    a[Math.floor(Math.random() * a.length)];

  if (!r) {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("خطأ")
          .setDescription(
            "عذراً، لم يتم العثور على أسئلة لهذه اللعبة حالياً."
          ),
      ],
      components: [],
    });

    return;
  }

  const c = await e.editReply({
    embeds: [ae(t, r, n)],
    components: [],
  });

  const l = ne(r, s);

  const u = await b(
    c.channel,
    (p) =>
      !p.author.bot &&
      l.includes(A(p.content)),
    n * 1000
  );

  if (u) {
    await f(
      u,
      s,
      r.points ?? 10,
      "إجابة صحيحة"
    );

    const p = new i()
      .setColor(y)
      .setTitle("إجابة صحيحة")
      .setDescription(
        `🎉 أجاب <@${u.author.id}> بشكل صحيح خلال الوقت المحدد.
الإجابة: **${r.answer}**`
      );

    if (r.image) {
      p.setThumbnail(r.image);
    }

    await $(e, p);
  } else {
    const p = new i()
      .setColor(d)
      .setTitle("انتهى الوقت")
      .setDescription(
        `لم يجب أحد خلال **${n} ثوانٍ**.
الإجابة الصحيحة كانت: **${r.answer}**`
      );

    if (r.image) {
      p.setThumbnail(r.image);
    }

    await $(e, p);
  }
}

/**
 * أزرار الاستمرار / الإلغاء.
 */
async function $(e, t) {
  const o = new h()
    .setCustomId("round:continue")
    .setLabel("استمرار")
    .setStyle(w.Success);

  const s = new h()
    .setCustomId("round:cancel")
    .setLabel("إلغاء")
    .setStyle(w.Secondary);

  const n = await e.followUp({
    embeds: [
      t.setFooter({
        text: "3RB Games • اختر استمرار للعب لعبة أخرى",
      }),
    ],
    components: [C([o, s])],
  });

  const a =
    await n
      .awaitMessageComponent({
        componentType: 2,
        time: te,
      })
      .catch(() => null);

  if (!a) {
    await n.edit({
      components: [],
    });

    return;
  }

  if (
    a.customId === "round:continue"
  ) {
    await a.update({
      components: [],
    });

    await e.followUp({
      embeds: [v()],
      components: [z()],
    });
  } else {
    await a.update({
      components: [],
    });
  }
}

/**
 * لعبة الفكاهة.
 */
async function le(e) {
  const t = [
    [
      "ما الشيء الذي كلما أخذت منه كبر؟",
      "الحفرة",
    ],
    [
      "لماذا ذهب الكمبيوتر إلى الطبيب؟",
      "لأنه أصيب بفيروس",
    ],
    [
      "ما أسرع شيء في العالم؟",
      "الخبر عندما ينتشر في السيرفر",
    ],
  ];

  const [o, s] =
    t[Math.floor(Math.random() * t.length)];

  const n = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("فكاهة")
        .setDescription(o)
        .setFooter({
          text: "اكتب إجابتك في القناة خلال 20 ثانية",
        }),
    ],
    components: [],
  });

  const a = await b(
    n.channel,
    (r) => !r.author.bot,
    20000
  );

  if (a) {
    await f(
      a,
      "jokes",
      10,
      "إجابة فكاهية"
    );

    await e.editReply({
      embeds: [
        new i()
          .setColor(y)
          .setTitle("جولة مرحة")
          .setDescription(
            `الإجابة النموذجية: **${s}**
أحسنت <@${a.author.id}> على المشاركة!`
          ),
      ],
    });
  } else {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("انتهى الوقت")
          .setDescription(
            `الإجابة كانت: **${s}**`
          ),
      ],
    });
  }
}

/**
 * ألعاب الكلمات.
 *
 * تم تعديل المقارنة هنا لتستخدم نفس نظام تنظيف
 * الإجابات العربية المستخدم في باقي الألعاب.
 */
async function de(e, t) {
  const o = X ?? [];

  const s =
    o[Math.floor(Math.random() * o.length)];

  if (!s) {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("خطأ")
          .setDescription(
            "لا توجد جولات كلمات متاحة حالياً."
          ),
      ],
    });

    return;
  }

  const n = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle(
          t === "words"
            ? "تجميع الكلمات"
            : "تركيب الحروف"
        )
        .setDescription(
          `رتّب الحروف التالية:

**${s.letters}**

اكتب الكلمة في القناة خلال 20 ثانية.`
        ),
    ],
  });

  const a = await b(
    n.channel,
    (r) =>
      !r.author.bot &&
      isCorrectAnswer(
        r.content,
        s.answer
      ),
    20000
  );

  if (a) {
    await f(
      a,
      t,
      15,
      "تركيب كلمة صحيح"
    );

    await e.editReply({
      embeds: [
        new i()
          .setColor(y)
          .setTitle("أحسنت!")
          .setDescription(
            `<@${a.author.id}> ركب الكلمة بشكل صحيح وحصل على **15 نقطة**.`
          ),
      ],
    });
  } else {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("انتهت الجولة")
          .setDescription(
            `الكلمة الصحيحة: **${s.answer}**`
          ),
      ],
    });
  }
}

/**
 * لعبة الروليت.
 */
async function me(e) {
  const t = new h()
    .setCustomId("roulette:join")
    .setLabel("شارك في العجلة")
    .setStyle(w.Primary);

  const o = new h()
    .setCustomId("roulette:spin")
    .setLabel("لف العجلة")
    .setStyle(w.Success);

  const s = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("عجلة الروليت")
        .setDescription(
          "اضغط للمشاركة. بعد 20 ثانية يستطيع أي مشارك لف العجلة."
        ),
    ],
    components: [C([t, o])],
  });

  const n = new Map();

  const a =
    s.createMessageComponentCollector({
      componentType: 2,
      time: 30000,
    });

  a.on("collect", async (r) => {
    if (
      r.customId === "roulette:join"
    ) {
      n.set(
        r.user.id,
        S(r)
      );

      await r.reply({
        content:
          "تمت إضافتك إلى العجلة.",
        ephemeral: true,
      });

      return;
    }

    if (n.size < 2) {
      await r.reply({
        content:
          "تحتاج العجلة إلى مشاركين اثنين على الأقل.",
        ephemeral: true,
      });

      return;
    }

    const c = [...n.entries()];

    const l =
      c[
        Math.floor(
          Math.random() * c.length
        )
      ];

    await k(
      l[0],
      l[1],
      "roulette",
      20,
      "فائز الروليت"
    );

    await r.update({
      embeds: [
        new i()
          .setColor(y)
          .setTitle(
            "الفائز في عجلة الروليت"
          )
          .setDescription(
            `الفائز هو <@${l[0]}>! حصل على **20 نقطة**.`
          )
          .addFields({
            name: "المشاركون",
            value: c
              .map(([, u]) => u)
              .join(" • "),
          }),
      ],
      components: [],
    });

    a.stop("winner");
  });

  a.on("end", async (r, c) => {
    if (c !== "winner") {
      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle("انتهت العجلة")
            .setDescription(
              "لم يتم لف العجلة في الوقت المحدد."
            ),
        ],
        components: [],
      });
    }
  });
}

/**
 * لعبة الغميضة.
 */
async function ue(e) {
  const t =
    J ?? ["مكان سري"];

  const o = t.map(
    (r, c) => `${c + 1}. ${r}`
  );

  const s =
    t[Math.floor(Math.random() * t.length)];

  const a = (
    await e.editReply({
      embeds: [
        new i()
          .setColor(m)
          .setTitle("غميضة")
          .setDescription(
            "اختر مكان اختبائك. المكان السري سيُكشف بعد انتهاء الوقت."
          ),
      ],
      components: [
        oe(`hide:${s}`, o),
      ],
    })
  ).createMessageComponentCollector({
    componentType: 3,
    time: 15000,
  });

  a.on("collect", async (r) => {
    const selected =
      o[Number(r.values[0])] ?? "";

    if (
      selected.includes(s)
    ) {
      await f(
        r,
        "hide-seek",
        15,
        "اختباء ناجح"
      );

      await r.update({
        embeds: [
          new i()
            .setColor(y)
            .setTitle("اختباء ناجح")
            .setDescription(
              `<@${r.user.id}> اختبأ بذكاء ولم يجده الباحث.`
            ),
        ],
        components: [],
      });
    } else {
      await r.update({
        embeds: [
          new i()
            .setColor(d)
            .setTitle("تم العثور عليك")
            .setDescription(
              `المكان السري كان: **${s}**`
            ),
        ],
        components: [],
      });
    }

    a.stop();
  });

  a.on("end", async (r) => {
    if (!r.size) {
      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle("انتهى الوقت")
            .setDescription(
              `المكان السري كان: **${s}**`
            ),
        ],
        components: [],
      });
    }
  });
}

/**
 * التحدي السريع.
 */
async function pe(e) {
  const t =
    Math.floor(Math.random() * 20) + 5;

  const o =
    Math.floor(Math.random() * 12) + 3;

  const s = t * o;

  const n = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("التحدي السريع")
        .setDescription(
          `أول شخص يكتب ناتج **${t} × ${o}** يفوز.

لديك 10 ثوانٍ.`
        ),
    ],
  });

  const a = await b(
    n.channel,
    (r) =>
      !r.author.bot &&
      isCorrectAnswer(
        r.content.trim(),
        String(s)
      ),
    10000
  );

  if (a) {
    await f(
      a,
      "quick",
      20,
      "حساب سريع"
    );

    await e.editReply({
      embeds: [
        new i()
          .setColor(y)
          .setTitle("سرعة مذهلة")
          .setDescription(
            `<@${a.author.id}> أجاب بشكل صحيح وحصل على **20 نقطة**.`
          ),
      ],
    });
  } else {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("لا فائز")
          .setDescription(
            `الإجابة الصحيحة: **${s}**`
          ),
      ],
    });
  }
}

/**
 * صيد الحرف.
 */
async function we(e) {
  const t = [
    "س",
    "م",
    "ب",
    "ك",
    "ع",
    "ف",
  ];

  const o =
    t[Math.floor(Math.random() * t.length)];

  const s = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("صيد الحرف")
        .setDescription(
          `اكتب أي كلمة تبدأ بحرف **${o}** خلال 12 ثانية.`
        ),
    ],
  });

  const n = await b(
    s.channel,
    (a) => {
      if (a.author.bot) {
        return false;
      }

      const content = A(a.content);

      const letter = A(o);

      return (
        content.length > 0 &&
        content.startsWith(letter)
      );
    },
    12000
  );

  if (n) {
    await f(
      n,
      "letter-catch",
      10,
      `كلمة تبدأ بحرف ${o}`
    );

    await e.editReply({
      embeds: [
        new i()
          .setColor(y)
          .setTitle("تم صيد الحرف")
          .setDescription(
            `<@${n.author.id}> كتب **${n.content}** وحصل على **10 نقاط**.`
          ),
      ],
    });
  } else {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("أفلت الحرف")
          .setDescription(
            `لم يكتب أحد كلمة تبدأ بحرف **${o}**.`
          ),
      ],
    });
  }
}

/**
 * لعبة العد.
 *
 * تم تحسين قراءة الأرقام العربية والأرقام الإنجليزية.
 */
async function ge(e) {
  const t =
    R.get(e.channelId) ?? {
      expected: 1,
      streak: 0,
      record: 0,
    };

  const o = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("عُد حتى الرقم")
        .setDescription(
          `اكتب الرقم **${t.expected}** فقط. كل إجابة صحيحة ترفع الستريك.
الستريك الحالي: **${t.streak}**`
        ),
    ],
  });

  const s = await b(
    o.channel,
    (n) => {
      if (n.author.bot) {
        return false;
      }

      return isCorrectAnswer(
        n.content.trim(),
        String(t.expected)
      );
    },
    15000
  );

  if (s) {
    t.expected += 1;
    t.streak += 1;
    t.record = Math.max(
      t.record,
      t.streak
    );

    R.set(e.channelId, t);

    await f(
      s,
      "counting",
      5,
      `ستريك ${t.streak}`
    );

    await Z(
      s.author.id,
      S(s),
      t.streak,
      t.record
    );

    await e.editReply({
      embeds: [
        new i()
          .setColor(y)
          .setTitle("ستريك مستمر")
          .setDescription(
            `<@${s.author.id}> حافظ على التسلسل. الرقم التالي **${t.expected}**.
الستريك: **${t.streak}** | الرقم القياسي: **${t.record}**`
          ),
      ],
    });
  } else {
    const expectedNumber = t.expected;

    t.expected = 1;
    t.streak = 0;

    R.set(e.channelId, t);

    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("انقطع العد")
          .setDescription(
            `كان الرقم المطلوب **${expectedNumber}**. بدأنا من جديد.`
          ),
      ],
    });
  }
}

/**
 * صراحة أم جرأة.
 */
async function he(e) {
  const t = new h()
    .setCustomId("truth-dare:truth")
    .setLabel("صراحة")
    .setStyle(w.Primary);

  const o = new h()
    .setCustomId("truth-dare:dare")
    .setLabel("جراءة")
    .setStyle(w.Danger);

  const n =
    await (
      await e.editReply({
        embeds: [
          new i()
            .setColor(m)
            .setTitle("صراحة أم جرأة")
            .setDescription(
              "اختر طريقك، ولا يوجد تراجع."
            ),
        ],
        components: [C([t, o])],
      })
    )
      .awaitMessageComponent({
        componentType: 2,
        time: 20000,
      })
      .catch(() => null);

  if (!n) {
    await e.editReply({
      embeds: [
        new i()
          .setColor(d)
          .setTitle("انتهى الوقت")
          .setDescription(
            "لم يختر أحد صراحة أو جرأة."
          ),
      ],
      components: [],
    });

    return;
  }

  const a =
    n.customId.endsWith("truth");

  const r = a
    ? q ?? ["سؤال صراحة افتراضي"]
    : V ?? ["تحدي جرأة افتراضي"];

  const c =
    r[Math.floor(Math.random() * r.length)];

  await f(
    n,
    "truth-dare",
    5,
    a ? "صراحة" : "جراءة"
  );

  await n.update({
    embeds: [
      new i()
        .setColor(a ? m : d)
        .setTitle(a ? "صراحة" : "جراءة")
        .setDescription(
          `<@${n.user.id}> ${c}

**5 نقاط** للمشاركة.`
        ),
    ],
    components: [],
  });
}

/**
 * لعبة الكراسي.
 */
async function ye(e) {
  const t = new h()
    .setCustomId("chairs:join")
    .setLabel("انضم للكراسي")
    .setStyle(w.Primary);

  const o = new h()
    .setCustomId("chairs:start")
    .setLabel("ابدأ السحب")
    .setStyle(w.Danger);

  const s = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("الكراسي")
        .setDescription(
          "انضم أولاً، ثم ابدأ الجولة. في كل دور تختفي كراسي ويضغط اللاعبون بسرعة."
        ),
    ],
    components: [C([t, o])],
  });

  const n = new Map();

  const a =
    s.createMessageComponentCollector({
      componentType: 2,
      time: 45000,
    });

  let r = false;

  a.on("collect", async (c) => {
    if (
      c.customId === "chairs:join"
    ) {
      if (r) {
        await c.reply({
          content:
            "بدأت الجولة بالفعل. انتظر الجولة القادمة.",
          ephemeral: true,
        });

        return;
      }

      if (
        !n.has(c.user.id) &&
        n.size >= 25
      ) {
        await c.reply({
          content:
            "وصلت الجولة إلى الحد الأقصى وهو 25 لاعباً.",
          ephemeral: true,
        });

        return;
      }

      n.set(
        c.user.id,
        S(c)
      );

      await c.reply({
        content: `انضممت. عدد اللاعبين الآن: ${n.size}`,
        ephemeral: true,
      });

      return;
    }

    if (
      c.customId !== "chairs:start"
    ) {
      return;
    }

    if (r) {
      await c.reply({
        content:
          "بدأت الجولة بالفعل.",
        ephemeral: true,
      });

      return;
    }

    if (n.size < 2) {
      await c.reply({
        content:
          "يجب أن ينضم لاعبان على الأقل.",
        ephemeral: true,
      });

      return;
    }

    r = true;

    a.stop("started");

    await c.update({
      embeds: [
        new i()
          .setColor(m)
          .setTitle("بدأت لعبة الكراسي")
          .setDescription(
            `عدد اللاعبين: **${n.size}**
في كل دور سيكون عدد الكراسي أقل من عدد اللاعبين. أول من يضغط على كرسي يحجزه.`
          ),
      ],
      components: [],
    });

    let l = [...n.entries()];

    for (; l.length > 1; ) {
      const u = Math.max(
        1,
        l.length - 2
      );

      const p = new Map(l);

      const F = await e.editReply({
        embeds: [N(p, u)],
        components: Q(u),
      });

      const B = await fe(
        F,
        p,
        u
      );

      const M = [...B.entries()];

      const x = l.filter(
        ([g]) => !B.has(g)
      );

      if (M.length === 0) {
        await $(
          e,
          new i()
            .setColor(d)
            .setTitle(
              "انتهت لعبة الكراسي"
            )
            .setDescription(
              "لم يجلس أحد على الكراسي في الوقت المحدد."
            )
        );

        return;
      }

      if (M.length === 1) {
        const [g, E] = M[0];

        await k(
          g,
          E,
          "chairs",
          25,
          "الفائز بالكراسي"
        );

        await $(
          e,
          new i()
            .setColor(y)
            .setTitle(
              "انتهت لعبة الكراسي"
            )
            .setDescription(
              `الفائز هو <@${g}> وحصل على **25 نقطة**.

تم استبعاد: ${
                x
                  .map(([O]) => `<@${O}>`)
                  .join("، ") ||
                "لا أحد"
              }`
            )
        );

        return;
      }

      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle("انتهى الدور")
            .setDescription(
              `جلس على الكراسي: ${M
                .map(
                  ([g]) => `<@${g}>`
                )
                .join("، ")}

تم استبعاد: ${
                x
                  .map(
                    ([g]) => `<@${g}>`
                  )
                  .join("، ")
              }`
            ),
        ],
        components: [],
      });

      await new Promise(
        (g) => setTimeout(g, 2000)
      );

      l = M;
    }
  });

  a.on("end", async (c, l) => {
    if (
      !r &&
      l === "time"
    ) {
      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle(
              "انتهى التسجيل"
            )
            .setDescription(
              "انتهى وقت تسجيل اللاعبين في الكراسي."
            ),
        ],
        components: [],
      });
    }
  });
}

/**
 * Embed الكراسي.
 */
function N(e, t) {
  const o = Array.from(
    { length: t },
    () => "🪑"
  ).join(" ");

  return new i()
    .setColor(m)
    .setTitle("استعدوا للكراسي")
    .setDescription(
      `اللاعبون: **${e.size}**
الكراسي: **${t}**

${o}

أول لاعب يضغط على كرسي يحجزه. لديك **10 ثوانٍ**.`
    )
    .setFooter({
      text: "3RB Games • من لا يجلس قبل امتلاء الكراسي يتم استبعاده",
    });
}

/**
 * أزرار الكراسي.
 */
function Q(e, t = new Map()) {
  const o = Array.from(
    { length: e },
    (n, a) => {
      const r = t.get(a);

      return new h()
        .setCustomId(
          `chairs:sit:${a}`
        )
        .setLabel(
          r
            ? `✅ ${_(r)}`
            : `🪑 كرسي ${a + 1}`
        )
        .setStyle(
          r
            ? w.Secondary
            : w.Success
        )
        .setDisabled(!!r);
    }
  );

  const s = [];

  for (
    let n = 0;
    n < o.length;
    n += 5
  ) {
    s.push(
      C(o.slice(n, n + 5))
    );
  }

  return s;
}

/**
 * استقبال ضغطات الكراسي.
 */
async function fe(e, t, o) {
  const s = new Map();
  const n = new Map();

  const a =
    e.createMessageComponentCollector({
      componentType: 2,
      time: 10000,
    });

  return await new Promise(
    (r) => {
      a.on(
        "collect",
        async (c) => {
          if (
            !c.customId.startsWith(
              "chairs:sit:"
            )
          ) {
            return;
          }

          if (
            !t.has(c.user.id)
          ) {
            await c.reply({
              content:
                "أنت لست مسجلاً في هذه الجولة.",
              ephemeral: true,
            });

            return;
          }

          if (
            n.has(c.user.id)
          ) {
            await c.reply({
              content:
                "حجزت كرسياً بالفعل.",
              ephemeral: true,
            });

            return;
          }

          const l = Number(
            c.customId.split(":")[2]
          );

          if (
            !Number.isInteger(l) ||
            s.has(l) ||
            n.size >= o
          ) {
            await c.reply({
              content:
                "هذا الكرسي محجوز.",
              ephemeral: true,
            });

            return;
          }

          s.set(
            l,
            c.user.id
          );

          n.set(
            c.user.id,
            t.get(c.user.id) ??
              S(c)
          );

          await c.update({
            embeds: [
              N(t, o).setDescription(
                `تم حجز **${n.size} من ${o}** كراسي.

${[...n.keys()]
                  .map(
                    (u) => `<@${u}>`
                  )
                  .join("، ")}`
              ),
            ],
            components: Q(o, s),
          });

          if (
            n.size >= o
          ) {
            a.stop("chairs-full");
          }
        }
      );

      a.once(
        "end",
        () => r()
      );
    }
  );
}

/**
 * المبارزة.
 */
async function be(e) {
  const t = new h()
    .setCustomId("duel:join")
    .setLabel("انضم للمبارزة")
    .setStyle(w.Primary);

  const o = await e.editReply({
    embeds: [
      new i()
        .setColor(m)
        .setTitle("مبارزة 1 ضد 1")
        .setDescription(
          "ينضم أول لاعبين، ثم يظهر سؤال سريع للفوز."
        ),
    ],
    components: [C([t])],
  });

  const s = [];

  const n =
    o.createMessageComponentCollector({
      componentType: 2,
      time: 30000,
    });

  n.on("collect", async (a) => {
    if (!s.includes(a.user.id)) {
      s.push(a.user.id);
    }

    await a.reply({
      content:
        "تم تسجيلك في المبارزة.",
      ephemeral: true,
    });

    if (s.length < 2) {
      return;
    }

    const r =
      Math.floor(Math.random() * 9) + 2;

    const c =
      Math.floor(Math.random() * 9) + 2;

    const l = r + c;

    n.stop("duel-ready");

    await e.editReply({
      embeds: [
        new i()
          .setColor(m)
          .setTitle("بدأت المبارزة")
          .setDescription(
            `<@${s[0]}> ضد <@${s[1]}>

أول لاعب يكتب ناتج **${r} + ${c}** يفوز.`
          ),
      ],
      components: [],
    });

    const u = await b(
      o.channel,
      (p) =>
        !p.author.bot &&
        s.includes(p.author.id) &&
        isCorrectAnswer(
          p.content.trim(),
          String(l)
        ),
      10000
    );

    if (u) {
      await f(
        u,
        "duel",
        30,
        "فوز في مبارزة"
      );

      await e.editReply({
        embeds: [
          new i()
            .setColor(y)
            .setTitle(
              "فوز في المبارزة"
            )
            .setDescription(
              `<@${u.author.id}> فاز وحصل على **30 نقطة**.`
            ),
        ],
      });
    } else {
      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle("تعادل")
            .setDescription(
              "انتهى الوقت دون إجابة صحيحة."
            ),
        ],
      });
    }
  });

  n.on("end", async (a, r) => {
    if (r === "time") {
      await e.editReply({
        embeds: [
          new i()
            .setColor(d)
            .setTitle(
              "لم تبدأ المبارزة"
            )
            .setDescription(
              "نحتاج لاعبين اثنين قبل انتهاء الوقت."
            ),
        ],
        components: [],
      });
    }
  });
}

export {
  De as handleGameSelection,
  Te as showGamePicker,
};
