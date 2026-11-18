// Original Malay dialogue. The research note, title, and source links stay beside each
// character so this file can also serve as the editable dialogue reference.
// The game replaces {food_item} and {drink_item} with the exact ticket items.
const variants = (greetings, orders) => greetings.map((greeting, i) => ({ greeting, order: orders[i] }));

export const CUSTOMER_DIALOGUE = {
  "david-martinez": {
    anime: "Cyberpunk: Edgerunners",
    personality: "Resilient and quick-thinking, with a strong sense of responsibility for his crew. Casual, direct Malay phrasing reflects his streetwise confidence and loyalty; slang is localized, not quoted.",
    references: ["https://www.cyberpunk.net/en/edgerunners", "https://cyberpunk.fandom.com/wiki/David_Martinez", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e02&tv-show=cyberpunk-edgerunners-2022"],
    greetingOrder: variants(
      [
      "Yo, apa khabar? Ada tempat kosong? Aku nak isi perut dulu.",
      "Hey, selamat malam. Fuh, bau makanan sini memang padu.",
      "Oi, hai. Aku singgah sekejap sebelum sambung kerja.",
      "Hello. Kedai ni nampak okay. Boleh aku tengok menu?",
      "Yo! Lama tak makan dengan tenang. Apa yang korang ada?"
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Buat cepat sikit, boleh?",
      "Okay, bagi aku {food_item} dan {drink_item}. Bungkus pun boleh.",
      "Aku ambil {food_item} sekali {drink_item}. Itu dah cukup.",
      "Catat {food_item} dengan {drink_item}. Aku makan sini.",
      "Untuk aku, {food_item} dan {drink_item}. Tak perlu susah-susah."
    ]
    ),
    waiting: [
    "Hey, pesanan aku masih on the way, kan? Aku boleh tunggu sekejap.",
    "Tak apa, aku faham dapur tengah sibuk. Cuma jangan lupa aku, ya.",
    "Hmm, lama juga. Aku bagi korang sedikit masa lagi."
  ],
    leaving: [
    "Okay, aku gerak dulu. Tak boleh tunggu sampai bila-bila.",
    "Lupakan pesanan tu. Aku cari tempat lain saja.",
    "Aku kena blah. Jaga diri, semua."
  ]
  },
  "gojo-satoru": {
    anime: "Jujutsu Kaisen",
    personality: "Confident, playful, and teasing, while perceptive and protective toward his students. His dialogue uses showy humor without borrowing catchphrases.",
    references: ["https://jujutsukaisen.jp/character/category6.php", "https://www.crunchyroll.com/series/GRDV0019R/jujutsu-kaisen", "https://github.com/doodles-tokyo/jujutsu-kaisen-transcripts/blob/main/jujutsu_kaisen_ep1_aligned_bilingual.md"],
    greetingOrder: variants(
      [
      "Heyyy! Hai, semua! Kedai ni nampak menarik. Aku boleh masuk, kan?",
      "Hello, hello! Wah, bau dia sedap. Terus rasa lapar pula.",
      "Yo! Pelanggan paling kacak dah sampai. Menu mana paling best?",
      "Hai! Jangan risau, aku pelanggan yang sangat mudah dijaga. Biasanya.",
      "Oho, tempat baru! Hai, chef. Bersedia nak buat aku kagum?"
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Pilihan yang hebat, macam aku.",
      "Bagi aku {food_item} dan {drink_item}, ya. Jangan kedekut dengan portion!",
      "Hmm, aku pilih {food_item} sekali {drink_item}. Nampak macam kombinasi menang.",
      "Okay, {food_item} dan {drink_item}. Chef, buat yang paling sedap tau!",
      "Aku ambil {food_item} dengan {drink_item}. Percayalah, aku ada taste yang bagus."
    ]
    ),
    waiting: [
    "Heeey, aku masih tunggu ni. Rindu sangat ke nak jumpa aku?",
    "Tak apa, take your time. Aku ni memang sabar... kadang-kadang.",
    "Hmm, dah separuh jalan menunggu. Ada perkembangan, chef?"
  ],
    leaving: [
    "Alaa, aku dah bagi peluang. Bye-bye, chef!",
    "Okay, aku pergi cari tempat yang lebih pantas. Jangan sedih sangat!",
    "Wah, lama betul. Nampaknya kehadiran aku tak dihargai. Aku blah dulu."
  ]
  },
  "isagi-yoichi": {
    anime: "Blue Lock",
    personality: "Friendly and reflective off the field, then sharply observant and adaptive when pursuing a goal. The lines move from weighing options to decisive sports-minded focus.",
    references: ["https://bluelock-anime-en.com/", "https://tv.bluelock-pr.com/tv2nd/", "https://subs.yakuaru.com/books/blue-lock/page/e1-dream"],
    greetingOrder: variants(
      [
      "Hai! Maaf, sini tempat untuk makan, kan? Bau dia sedap betul.",
      "Hello. Aku baru habis latihan. Memang kena cari makan sekarang.",
      "Hey, kedai ni nampak selesa. Boleh aku tengok menu dulu?",
      "Hai, semua. Aku perlukan sesuatu untuk pulihkan tenaga.",
      "Oh, hai! Nasib baik jumpa kedai ni. Aku dah lapar."
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Rasanya itu pilihan paling sesuai.",
      "Boleh sediakan {food_item} dan {drink_item}? Aku perlukan tenaga.",
      "Okay, aku pilih {food_item} sekali {drink_item}. Itu kombinasi terbaik buat masa ni.",
      "Aku ambil {food_item} dengan {drink_item}. Lepas ni boleh sambung latihan.",
      "Hmm, {food_item} dan {drink_item}. Ya, itu yang aku perlukan."
    ]
    ),
    waiting: [
    "Tak apa, aku boleh tunggu. Aku cuba kekalkan fokus dulu.",
    "Hmm, agak lama juga. Harap pesanan aku tak tersangkut.",
    "Aku masih boleh tunggu. Cuma aku kena jaga masa latihan."
  ],
    leaving: [
    "Maaf, aku kena pergi. Aku tak boleh terlepas latihan seterusnya.",
    "Aku dah tunggu agak lama. Aku cari tempat lain dulu.",
    "Nampaknya tak sempat. Aku gerak dulu, ya."
  ]
  },
  "ishigami-senku": {
    anime: "Dr. Stone",
    personality: "A brisk, confident science-minded problem-solver who relies on observation and evidence. Dialogue is analytical and wry without repeating signature catchphrases.",
    references: ["https://dr-stone.jp/character/", "https://www.crunchyroll.com/news/guides/2025/2/22/dr-stone-character-guide", "https://subs.yakuaru.com/books/drstone/page/e2-hot-line"],
    greetingOrder: variants(
      [
      "Yo, hai. Kedai ni nampak menarik. Apa yang paling laku?",
      "Hello. Bau dari dapur tu cukup meyakinkan. Aku nak tengok menu.",
      "Oi, apa khabar? Aku singgah nak makan. Ringkas saja.",
      "Hai. Menarik juga tempat ni. Dapur nampak sibuk.",
      "Hey, aku lapar. Ada sesuatu yang berbaloi untuk dicuba?"
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Nak tengok sama ada rasanya sehebat baunya.",
      "Bagi aku {food_item} dan {drink_item}. Itu cukup untuk isi tenaga.",
      "Hmm, aku pilih {food_item} sekali {drink_item}. Nampak macam pilihan yang masuk akal.",
      "Catat {food_item} dengan {drink_item}. Aku nak cuba sendiri.",
      "Aku ambil {food_item} dan {drink_item}. Tak perlu buat kecoh."
    ]
    ),
    waiting: [
    "Heh, dah agak lama. Dapur tengah hadapi masalah teknikal ke?",
    "Tak apa, aku tunggu. Sementara tu aku boleh perhatikan cara korang bekerja.",
    "Hmm. Kalau ikut kelajuan sekarang, mungkin kena tunggu lagi sedikit."
  ],
    leaving: [
    "Baiklah, aku dah tunggu cukup lama. Aku cari makanan di tempat lain.",
    "Nampaknya proses ni ambil masa lebih daripada yang patut. Aku gerak dulu.",
    "Okay, eksperimen makan dekat sini tamat. Jumpa lagi."
  ]
  },
  "ken-takakura": {
    anime: "Dandadan",
    personality: "Okarun is shy, earnest, and fascinated by the occult, but can act bravely when friends need him. Detailed speech varies by scene; these Malay originals use cautious, polite phrasing.",
    references: ["https://anime-dandadan.com/en/character/", "https://www.oricon-group.com/news/2496/"],
    greetingOrder: variants(
      [
      "E-err, hai! Kedai ni masih buka, kan?",
      "H-hello. Bau makanan dia... memang sedap. Saya boleh pesan?",
      "Hai, maaf. Saya baru pertama kali datang sini.",
      "Oh, hai! Tempat ni nampak selesa. Saya nak tengok menu dulu.",
      "S-selamat petang. Harap saya tak datang waktu terlalu sibuk."
    ],
      [
      "Saya nak {food_item} dengan {drink_item}, kalau boleh. Terima kasih.",
      "Boleh saya pesan {food_item} dan {drink_item}? Maaf menyusahkan.",
      "Err, saya pilih {food_item} sekali {drink_item}. Itu saja.",
      "Kalau tak keberatan, saya ambil {food_item} dengan {drink_item}.",
      "Satu {food_item} dan {drink_item}, ya. Terima kasih banyak."
    ]
    ),
    waiting: [
    "Tak apa, saya boleh tunggu. Awak tentu tengah sibuk.",
    "Err, pesanan saya belum siap lagi, ya? Tak mengapa, saya tunggu.",
    "Saya mula lapar sedikit... tapi tak apa, saya boleh bersabar."
  ],
    leaving: [
    "Maaf, saya rasa saya perlu pergi dulu. Terima kasih.",
    "Saya tak nak menyusahkan, tapi saya kena gerak sekarang.",
    "Err, mungkin saya cuba datang lain kali. Jumpa lagi."
  ]
  },
  "kohaku": {
    anime: "Dr. Stone",
    personality: "A capable warrior: direct, observant, energetic, and loyal. She shows care through action rather than grand sentiment.",
    references: ["https://dr-stone.jp/character/", "https://www.crunchyroll.com/news/guides/2025/2/22/dr-stone-character-guide", "https://subs.yakuaru.com/books/drstone/page/e21-treasure-island"],
    greetingOrder: variants(
      [
      "Oi, salam! Kedai ini menerima pelanggan, bukan?",
      "Hai! Aku baru selesai urusan. Memang sesuai untuk makan sebentar.",
      "Hello. Bau makanan dari dapur itu bagus. Apa yang ada?",
      "Selamat petang! Aku singgah untuk mengisi tenaga.",
      "Hey, ada orang? Aku mahu pesan makanan."
    ],
      [
      "Beri aku {food_item} dan {drink_item}. Aku perlu kembali bertugas.",
      "Aku ambil {food_item} bersama {drink_item}. Cukup untuk pulihkan tenaga.",
      "Sediakan {food_item} dan {drink_item}, ya. Aku tak cerewet.",
      "Aku mahu {food_item} dengan {drink_item}. Itu sudah memadai.",
      "Catat {food_item} dan {drink_item}. Aku makan di sini."
    ]
    ),
    waiting: [
    "Aku boleh tunggu. Sedikit rehat tidak akan memudaratkan.",
    "Teruskan kerja. Aku tak mahu mengganggu orang dapur.",
    "Agak lama juga, tetapi aku masih ada sedikit masa."
  ],
    leaving: [
    "Aku perlu pergi sekarang. Ada urusan yang menanti.",
    "Cukuplah menunggu. Aku akan cari makanan di tempat lain.",
    "Aku gerak dulu. Semoga kerja kamu dipermudahkan."
  ]
  },
  "kurapika": {
    anime: "Hunter x Hunter",
    personality: "Composed, knowledgeable, formally polite, and resolute. Requests are precise and measured, without reducing every ordinary exchange to revenge.",
    references: ["https://www.ntv.co.jp/hunterhunter/character/kurapika.html", "https://hunterhunter-ni.bushiroad.com/en/character/kurapika/", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e02&tv-show=hunter-x-hunter-2011"],
    greetingOrder: variants(
      [
      "Selamat petang. Adakah masih ada tempat untuk seorang?",
      "Hello. Terima kasih. Boleh saya lihat menu sebentar?",
      "Hai. Suasana di sini agak tenang. Saya suka.",
      "Selamat sejahtera. Saya ingin membuat pesanan.",
      "Maaf mengganggu. Kedai ini masih menerima pesanan, bukan?"
    ],
      [
      "Saya ingin {food_item} bersama {drink_item}, sila.",
      "Boleh sediakan {food_item} dan {drink_item}? Terima kasih.",
      "Saya akan mengambil {food_item} serta {drink_item}. Itu sahaja.",
      "Tolong catat {food_item} dengan {drink_item}.",
      "Untuk saya, {food_item} dan {drink_item}. Sila pastikan pesanannya tepat."
    ]
    ),
    waiting: [
    "Saya tidak keberatan menunggu sedikit lagi. Terima kasih.",
    "Boleh saya tahu anggaran masa menunggu? Saya perlu mengatur urusan saya.",
    "Saya faham dapur mungkin sibuk. Saya akan tunggu buat masa ini."
  ],
    leaving: [
    "Maaf, saya perlu beredar sekarang. Terima kasih atas layanan.",
    "Saya sudah menunggu agak lama. Saya akan mencari tempat lain.",
    "Nampaknya saya tidak dapat menunggu lebih lama. Selamat tinggal."
  ]
  },
  "l-lawliet": {
    anime: "Death Note",
    personality: "An observant, unconventional detective: reserved, bluntly analytical, and privately fond of sweets. The cadence here is an original approximation, not a quotation.",
    references: ["https://www.crunchyroll.com/series/G6K2W4K4R/death-note", "https://deathnote.fandom.com/wiki/L_(character)", "https://deathnote.fandom.com/wiki/Category:Transcripts", "https://nadeshiko.co/en/media/death-note"],
    greetingOrder: variants(
      [
      "Hello. Boleh saya duduk di sini? Saya lebih suka tempat yang tenang.",
      "Hai. Saya tertarik dengan kedai ini. Menu manis ada?",
      "Selamat petang. Saya cuma mahu makan sesuatu sambil memerhati.",
      "Hello. Jangan risau, saya cuma pelanggan biasa.",
      "Hai. Saya belum pernah makan di sini. Menarik."
    ],
      [
      "Saya mahu {food_item} dan {drink_item}. Boleh hantar ke meja ini?",
      "Saya akan ambil {food_item} bersama {drink_item}. Terima kasih.",
      "Hmm, {food_item} dan {drink_item}. Saya ingin tahu sama ada rasanya sepadan.",
      "Boleh sediakan {food_item} dengan {drink_item}? Saya tak kisah menunggu sedikit.",
      "Saya pesan {food_item} dan {drink_item}. Itu pilihan yang munasabah."
    ]
    ),
    waiting: [
    "Saya rasa pesanan saya masih belum siap. Betul?",
    "Tak mengapa. Saya boleh tunggu sambil memerhatikan keadaan.",
    "Agak lama. Mungkin dapur sedang menguji kesabaran pelanggan."
  ],
    leaving: [
    "Saya rasa lebih baik saya makan di tempat lain.",
    "Saya sudah menunggu cukup lama. Saya akan pergi sekarang.",
    "Baiklah. Pemerhatian saya tamat di sini. Selamat tinggal."
  ]
  },
  "loid-forger": {
    anime: "Spy x Family",
    personality: "A capable spy who presents himself as a courteous professional and plans around other people's needs. Family concern sometimes peeks through his controlled, efficient manner.",
    references: ["https://spy-family.net/tvseries/", "https://www.crunchyroll.com/news/guides/2024/4/18/spy-x-family-characters", "https://www.subtitlecat.com/subs/378/SPY-x-FAMILY-S01E02-SECURE-A-WIFE.eng_.html"],
    greetingOrder: variants(
      [
      "Selamat petang. Maaf, adakah masih boleh membuat pesanan?",
      "Hello. Saya singgah sebentar sebelum urusan seterusnya.",
      "Hai, terima kasih. Boleh saya lihat menu?",
      "Selamat tengah hari. Kedai ini nampak sesuai untuk makan cepat.",
      "Hello. Saya harap saya tidak datang pada waktu yang terlalu sibuk."
    ],
      [
      "Saya pesan {food_item} dan {drink_item}. Jika boleh, sediakan secepat mungkin.",
      "Boleh bungkus {food_item} bersama {drink_item}? Saya perlu bergerak selepas ini.",
      "Saya ambil {food_item} dengan {drink_item}. Terima kasih.",
      "Untuk saya, {food_item} dan {drink_item}. Itu sahaja.",
      "Sediakan {food_item} bersama {drink_item}, ya. Saya hargai bantuan anda."
    ]
    ),
    waiting: [
    "Saya faham dapur sedang sibuk. Saya boleh tunggu sedikit lagi.",
    "Terima kasih. Boleh beritahu jika pesanan saya mengambil masa lebih lama?",
    "Tidak mengapa, saya masih boleh susun semula jadual."
  ],
    leaving: [
    "Maaf, saya perlu beredar. Ada urusan keluarga yang menanti.",
    "Saya tidak dapat menunggu lebih lama. Terima kasih atas bantuan anda.",
    "Nampaknya saya perlu mencari pilihan lain. Selamat tinggal."
  ]
  },
  "lucyna-kushinada": {
    anime: "Cyberpunk: Edgerunners",
    personality: "A guarded, independent netrunner who values freedom and control, yet becomes quietly protective of trusted people. Her speech is concise and cool, softening in small moments.",
    references: ["https://www.cyberpunk.net/en/edgerunners", "https://cyberpunk.fandom.com/wiki/Lucyna_Kushinada", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e06&tv-show=cyberpunk-edgerunners-2022"],
    greetingOrder: variants(
      [
      "Hey. Tempat ni nampak tenang. Masih ada tempat?",
      "Hai. Aku cuma nak berehat sekejap dan makan sesuatu.",
      "Hello. Jangan risau, aku tahu apa yang aku nak.",
      "Yo. Kedai ni jauh dari bising. Aku suka.",
      "Hai. Boleh tengok menu? Aku tak nak buang masa."
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Bungkus, boleh?",
      "Bagi aku {food_item} dan {drink_item}. Tak perlu banyak soal.",
      "Aku ambil {food_item} sekali {drink_item}. Cepat sikit.",
      "Satu {food_item}, satu {drink_item}. Aku tunggu sini.",
      "Aku pesan {food_item} dengan {drink_item}. Itu saja."
    ]
    ),
    waiting: [
    "Aku boleh tunggu sekejap. Jangan lupa pesanan aku.",
    "Hmm, lama juga. Dapur masih berfungsi?",
    "Tak perlu kelam-kabut. Cuma beritahu kalau ada masalah."
  ],
    leaving: [
    "Aku gerak dulu. Tak berbaloi tunggu lama-lama.",
    "Lupakan pesanan tu. Aku cari tempat lain.",
    "Dah cukup. Jaga diri."
  ]
  },
  "luffy": {
    anime: "One Piece",
    personality: "A carefree, frank, adventurous captain with an enormous appetite and simple priorities. His voice is energetic, direct, and focused on food and the next adventure.",
    references: ["https://one-piece.com/character/luffy/index.html", "https://onepiece.fandom.com/wiki/Monkey_D._Luffy/Personality", "https://subs.yakuaru.com/books/one-piece/page/e310-from-the-sea-a-friend-arrives-the-straw-hats-share-the-strongest-bond"],
    greetingOrder: variants(
      [
      "WOI! HAI! Bau apa sedap sangat ni?!",
      "Hello!! Kedai ni jual makanan, kan?! Aku lapar!",
      "Oi, ada orang! Aku nak makan!",
      "Wahhh! Hai! Banyak makanan sedap kat sini ke?",
      "HEY! Aku datang! Perut aku dah tak tahan!"
    ],
      [
      "Aku nak {food_item} dengan {drink_item}! Cepat, aku lapar!",
      "Bagi aku {food_item}! Oh, dan {drink_item} sekali!",
      "Aku pesan {food_item} dan {drink_item}! Banyak sikit kalau boleh!",
      "{food_item} dengan {drink_item}! Aku nak makan sekarang!",
      "Aku nak dua-dua, {food_item} dan {drink_item}! Nampak sedap!"
    ]
    ),
    waiting: [
    "WEH, lama lagi ke?! Bau makanan tu buat aku makin lapar!",
    "Aku cuba tunggu... tapi perut aku tak nak dengar cakap!",
    "Makanan aku mana?! Aku dah tak sabar!"
  ],
    leaving: [
    "AKU PERGI CARI MAKANAN LAIN! JUMPA LAGI!",
    "Dah lama sangat! Aku nak makan sekarang!",
    "Tak boleh tahan dah! Aku cari kedai lain!"
  ]
  },
  "mao-mao": {
    anime: "The Apothecary Diaries",
    personality: "A practical, sharp-eyed apothecary curious about ingredients, but emotionally restrained and often dryly amused. The lines avoid treating poison as a casual joke.",
    references: ["https://kusuriyanohitorigoto.jp/season2/character/index.php", "https://www.crunchyroll.com/news/guides/2025/6/4/the-apothecary-diaries-characters", "https://www.tumgag.com/anime-dub-transcripts"],
    greetingOrder: variants(
      [
      "Selamat petang. Hai. Dapur ini menggunakan herba yang menarik, ya?",
      "Hello. Bau rempahnya agak kuat. Saya ingin melihat menu.",
      "Hai. Saya cuma mahu makan. Buat masa ini.",
      "Oh, selamat datang... eh, maksud saya, saya yang datang. Boleh pesan?",
      "Selamat sejahtera. Ada hidangan yang menggunakan herba atau rempah istimewa?"
    ],
      [
      "Saya mahu {food_item} dengan {drink_item}. Boleh beritahu bahan utamanya?",
      "Bawakan {food_item} dan {drink_item}, ya. Saya mahu cuba rasanya sendiri.",
      "Saya ambil {food_item} bersama {drink_item}. Jangan tambah apa-apa yang pelik.",
      "Hmm, {food_item} dan {drink_item}. Saya ingin tahu rasanya.",
      "Saya pesan {food_item} serta {drink_item}. Itu sahaja."
    ]
    ),
    waiting: [
    "Tak mengapa. Saya boleh cuba teka bahan daripada baunya sementara menunggu.",
    "Agak lama juga. Dapur sedang menyediakan sesuatu yang rumit?",
    "Saya masih boleh tunggu. Rasa ingin tahu saya belum hilang."
  ],
    leaving: [
    "Baiklah, saya cari makanan di tempat lain. Terima kasih.",
    "Saya sudah menunggu agak lama. Saya perlu beredar.",
    "Nampaknya saya tak akan dapat mencuba hidangan itu hari ini."
  ]
  },
  "rudeus-greyrat": {
    anime: "Mushoku Tensei: Jobless Reincarnation",
    personality: "A reflective, flawed person trying to live more earnestly and learn from experience. His polite, slightly self-conscious manner is grounded in a stated wish to do better.",
    references: ["https://mushokutensei.jp/character/", "https://mushokutensei.fandom.com/wiki/Rudeus_Greyrat", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e18&tv-show=mushoku-tensei-jobless-reincarnation-2021"],
    greetingOrder: variants(
      [
      "Selamat petang! Maaf, masih ada tempat untuk seorang?",
      "Hello. Tempat ini nampak selesa. Saya singgah untuk berehat.",
      "Hai. Saya baru tiba dari perjalanan yang agak jauh.",
      "Selamat sejahtera. Boleh saya lihat menu?",
      "Oh, hai. Bau makanan di sini memang menyenangkan."
    ],
      [
      "Kalau boleh, saya mahu {food_item} dan {drink_item}. Terima kasih.",
      "Saya pesan {food_item} bersama {drink_item}. Nampaknya sedap.",
      "Boleh sediakan {food_item} dengan {drink_item} untuk saya?",
      "Saya ambil {food_item} dan {drink_item}. Terima kasih kerana membantu.",
      "Hmm, saya pilih {food_item} sekali {drink_item}. Itu saja."
    ]
    ),
    waiting: [
    "Tak mengapa, saya boleh tunggu. Saya tak mahu mendesak.",
    "Maaf, boleh saya tahu kalau pesanan saya masih dalam proses?",
    "Saya faham. Saya akan tunggu sedikit lagi."
  ],
    leaving: [
    "Maaf, saya perlu sambung perjalanan. Terima kasih.",
    "Saya rasa saya perlu pergi dulu. Mungkin lain kali.",
    "Terima kasih atas layanan, tapi saya tak dapat tunggu lebih lama."
  ]
  },
  "satou-kazuma": {
    anime: "KonoSuba: God's Blessing on This Wonderful World!",
    personality: "A pragmatic, sarcastic adventurer who worries about money and gets dragged into absurd situations. His casual requests and dry complaints keep a deal-conscious tone.",
    references: ["https://konosuba.com/3rd/character/", "https://www.crunchyroll.com/id/news/guides/2024/6/26/konosuba-characters", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e07&tv-show=konosuba-gods-blessing-on-this-wonderful-world-2016"],
    greetingOrder: variants(
      [
      "Yo, hai. Kedai ni nampak okay. Harga pun harap okay.",
      "Hello. Ada menu bajet tak? Aku tengah cuba berjimat.",
      "Oi, masih buka? Aku perlukan makanan yang tak cekik darah.",
      "Hai. Aku cuma nak makan dengan aman. Boleh?",
      "Selamat petang. Tolonglah, biar hari ni tak ada masalah pelik."
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Berapa semua sekali?",
      "Bagi aku {food_item} dan {drink_item}. Ada set murah tak?",
      "Aku ambil {food_item} sekali {drink_item}. Jangan ada caj tersembunyi sudah.",
      "Okay, {food_item} dan {drink_item}. Harga dia masuk akal, kan?",
      "Catat {food_item} dengan {drink_item}. Aku kena jaga bajet."
    ]
    ),
    waiting: [
    "Haih, lama juga. Masa menunggu ni ada diskaun tak?",
    "Aku boleh tunggu, tapi meter kesabaran aku jalan sekali dengan duit.",
    "Seriuslah? Aku cuma pesan makanan, bukan minta buat senjata lagenda."
  ],
    leaving: [
    "Sudahlah, aku pergi tempat lain. Duit aku pun nak berehat.",
    "Aku tarik balik pesanan. Tak berbaloi tunggu selama ni.",
    "Okay, cukup. Aku cari kedai yang lebih cekap."
  ]
  },
  "sosuke-aizen": {
    anime: "Bleach",
    personality: "Composed, gracious, and highly controlled; his polite manner can feel quietly unsettling. The everyday lines stay restrained instead of revealing villainous intent.",
    references: ["https://bleach-anime.com/en/character/?chara=77-Official", "https://www.oricon-group.com/news/2402/", "https://www.subtitlecat.com/subs/1679/BLEACH%20Thousand-Year%20Blood%20War%20-%20S04E08.en.html"],
    greetingOrder: variants(
      [
      "Selamat petang. Hai. Suasana di sini cukup menyenangkan.",
      "Hello. Saya harap saya tidak mengganggu kesibukan anda.",
      "Selamat sejahtera. Kedai ini nampaknya diurus dengan baik.",
      "Hai. Saya tertarik untuk mencuba hidangan di sini.",
      "Selamat petang. Boleh saya lihat menu anda?"
    ],
      [
      "Saya ingin {food_item} bersama {drink_item}. Terima kasih.",
      "Bawakan {food_item} dan {drink_item}, apabila sudah tersedia.",
      "Saya akan mengambil {food_item} serta {drink_item}. Saya serahkan kepada anda.",
      "Untuk saya, {food_item} dan {drink_item}. Sila sediakan seperti biasa.",
      "Saya pesan {food_item} dengan {drink_item}. Saya menantikan hasilnya."
    ]
    ),
    waiting: [
    "Tidak perlu tergesa-gesa. Saya masih boleh menunggu.",
    "Saya faham. Setiap perkara ada waktunya.",
    "Menarik. Saya ingin melihat bagaimana keadaan ini diselesaikan."
  ],
    leaving: [
    "Nampaknya sudah tiba masanya untuk saya beredar. Terima kasih.",
    "Saya tidak mahu mengambil lebih banyak masa anda. Selamat tinggal.",
    "Baiklah, saya akan mencari tempat lain. Semoga hari anda baik."
  ]
  },
  "suzuki-iruma": {
    anime: "Welcome to Demon School! Iruma-kun",
    personality: "Kind-hearted and considerate, tries not to inconvenience others, and often gets swept into events despite himself. His voice is gentle, grateful, and a little hesitant.",
    references: ["https://www.nhk-character.com/chara/iruma/en/character", "https://www.crunchyroll.com/news/features/2026/5/26/welcome-to-demon-school-iruma-kun-comedy", "https://subs.yakuaru.com/books/welcome-to-demon-school-iruma-kun/page/e1-iruma-kun-from-demon-school"],
    greetingOrder: variants(
      [
      "H-Hai! Kedai ini nampak sangat menyenangkan!",
      "Hello! Maaf, saya boleh masuk? Bau makanan dia sedap!",
      "Hai, semua! Terima kasih sebab menerima pelanggan.",
      "Selamat petang! Saya gembira dapat singgah di sini.",
      "Oh, hai! Saya harap kedai ini belum terlalu sibuk."
    ],
      [
      "Kalau tak menyusahkan, saya nak {food_item} dan {drink_item}.",
      "Boleh saya pesan {food_item} dengan {drink_item}? Terima kasih!",
      "Saya pilih {food_item} sekali {drink_item}. Semuanya nampak sedap!",
      "Satu {food_item} dan {drink_item}, ya. Terima kasih banyak!",
      "Saya nak {food_item} dengan {drink_item}. Kalau boleh, ya!"
    ]
    ),
    waiting: [
    "Tak apa, saya boleh tunggu! Awak teruskan kerja dulu.",
    "Maaf, dapur sibuk, ya? Saya tak kisah tunggu sedikit lagi.",
    "Terima kasih sebab berusaha. Saya masih boleh bersabar!"
  ],
    leaving: [
    "Maaf, saya kena pergi dulu. Terima kasih banyak!",
    "Saya tak mahu menyusahkan lagi. Mungkin saya datang semula nanti.",
    "Aduh, saya dah agak lapar. Saya cari makanan dulu, ya."
  ]
  },
  "sylphiette-greyrat": {
    anime: "Mushoku Tensei: Jobless Reincarnation",
    personality: "Gentle, thoughtful, and loyal; her growing confidence does not erase her considerate nature. The soft Malay phrasing is a cautious localization, not a claimed catchphrase.",
    references: ["https://mushokutensei.jp/character/", "https://mushokutensei.fandom.com/wiki/Sylphiette_Greyrat", "https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e18&tv-show=mushoku-tensei-jobless-reincarnation-2021"],
    greetingOrder: variants(
      [
      "Hai! Selamat petang. Kedai ini nampak selesa.",
      "Hello. Saya singgah untuk berehat dan makan sedikit.",
      "Oh, hai. Bau makanan ini menyenangkan betul.",
      "Selamat sejahtera. Masih ada tempat untuk seorang?",
      "Hai, maaf mengganggu. Boleh saya tengok menu?"
    ],
      [
      "Kalau boleh, saya mahu {food_item} dengan {drink_item}. Terima kasih.",
      "Boleh sediakan {food_item} dan {drink_item}? Itu sudah cukup.",
      "Saya pilih {food_item} bersama {drink_item}. Terima kasih banyak.",
      "Saya pesan {food_item} dan {drink_item}, ya.",
      "Boleh bungkus {food_item} dengan {drink_item}? Saya nak bawa pulang."
    ]
    ),
    waiting: [
    "Tak mengapa, saya boleh tunggu. Awak tentu sibuk.",
    "Saya masih boleh bersabar. Terima kasih kerana menyediakan pesanan.",
    "Maaf, saya cuma nak tanya... pesanan saya masih belum siap, ya?"
  ],
    leaving: [
    "Maaf, saya perlu pergi dulu. Terima kasih atas bantuan awak.",
    "Saya tak mahu mengganggu lagi. Mungkin lain kali.",
    "Saya perlu pulang sekarang. Semoga hari awak baik."
  ]
  },
  "vamola": {
    anime: "Dandadan",
    personality: "The official anime profile confirms her role, but accessible sources give limited detail about Vamola's Malay-language speech. These short, curious lines are a localization of a newcomer learning to communicate, not exact phrasing.",
    references: ["https://anime-dandadan.com/en/character/", "https://en.wikipedia.org/wiki/List_of_Dandadan_characters"],
    greetingOrder: variants(
      [
      "Hai! Vamola datang! Bau makanan bagus!",
      "Hello! Ini kedai makan? Vamola mahu cuba!",
      "Wah, hai! Banyak makanan! Vamola suka!",
      "Hai, manusia! Vamola boleh makan di sini?",
      "Hello! Tempat ini nampak seronok. Vamola lapar!"
    ],
      [
      "Vamola mahu {food_item} dan {drink_item}! Boleh?",
      "Satu {food_item}, satu {drink_item}! Vamola nak cuba!",
      "Beri Vamola {food_item} dengan {drink_item}. Terima kasih!",
      "Vamola pilih {food_item} dan {drink_item}. Nampak sedap!",
      "{food_item} dan {drink_item}, ya! Vamola lapar!"
    ]
    ),
    waiting: [
    "Vamola tunggu! Makanan belum siap?",
    "Bau sedap! Vamola boleh tunggu sedikit lagi.",
    "Hai? Pesanan Vamola datang nanti?"
  ],
    leaving: [
    "Vamola pergi cari makanan lain. Bye-bye!",
    "Lama tunggu. Vamola pergi dulu!",
    "Tak apa! Vamola cuba kedai lain!"
  ]
  },
  "yor-forger": {
    anime: "Spy x Family",
    personality: "Kind-hearted and devoted to her family, but socially awkward and inexperienced with ordinary situations. Her speech stays courteous and earnest, sometimes overthinking a simple choice.",
    references: ["https://spy-family.net/tvseries/", "https://us.oricon-group.com/news/5593/", "https://www.subtitlecat.com/subs/378/SPY-x-FAMILY-S01E02-SECURE-A-WIFE.eng_.html"],
    greetingOrder: variants(
      [
      "Selamat petang! H-Hai. Kedai ini masih menerima pelanggan?",
      "Hello! Maaf, saya harap saya tak datang waktu sibuk.",
      "Hai. Tempat ini nampak menyenangkan. Saya gembira dapat singgah.",
      "Selamat sejahtera! Saya baru selesai kerja dan ingin makan sedikit.",
      "Oh, hai! Saya mahu pesan sesuatu sebelum pulang."
    ],
      [
      "Boleh saya pesan {food_item} dan {drink_item}? Terima kasih!",
      "Saya ambil {food_item} bersama {drink_item}. Boleh bungkus dengan kemas?",
      "Kalau boleh, saya mahu {food_item} dan {drink_item}.",
      "Saya pesan {food_item} dengan {drink_item}. Itu saja, terima kasih.",
      "Satu {food_item} dan {drink_item}, ya. Saya harap pilihan ini sesuai."
    ]
    ),
    waiting: [
    "Tak mengapa, saya boleh tunggu. Awak tentu sedang berusaha.",
    "Maaf, saya tak mahu mendesak. Pesanan saya masih dalam proses, ya?",
    "Saya boleh tunggu lagi! Jangan risau tentang saya."
  ],
    leaving: [
    "Maaf, saya perlu pulang sekarang. Terima kasih banyak.",
    "Saya tak mahu menyusahkan awak lagi. Saya pergi dulu.",
    "Aduh, saya perlu bergerak. Mungkin saya datang semula nanti."
  ]
  },
  "yuzaki-nasa": {
    anime: "TONIKAWA: Over The Moon For You",
    personality: "A diligent, decisive planner who likes calculating details, but is sincere and warmly devoted to Tsukasa. His dialogue is efficient and numbers-minded, with personal warmth.",
    references: ["https://tonikawa.com/character/nasa-yuzaki/", "https://www.aniplus-asia.com/show/tonikawa-over-the-moon-for-you/", "https://subs.yakuaru.com/books/tonikawa-over-the-moon-for-you/page/e1-formulas-for-the-moon-and-stars"],
    greetingOrder: variants(
      [
      "Hello! Selamat petang. Ada meja untuk dua orang?",
      "Hai. Saya singgah untuk makan sebelum sambung urusan.",
      "Selamat sejahtera. Menu di sini nampak mudah difahami.",
      "Oh, hai! Saya dan Tsukasa mungkin akan suka tempat ini.",
      "Hello. Saya ada masa rehat sekejap. Boleh saya pesan?"
    ],
      [
      "Saya nak {food_item} dan {drink_item}. Boleh sediakan sekali?",
      "Saya pilih {food_item} dengan {drink_item}. Itu kombinasi yang baik.",
      "Satu {food_item} dan {drink_item}, tolong. Terima kasih.",
      "Saya pesan {food_item} bersama {drink_item}. Berapa lama anggaran siap?",
      "Saya ambil {food_item} dan {drink_item}. Mungkin Tsukasa nak rasa juga."
    ]
    ),
    waiting: [
    "Hmm, masa menunggu sedikit lebih lama daripada jangkaan. Tak mengapa.",
    "Saya boleh tunggu. Saya cuma perlu laraskan jadual selepas ini.",
    "Maaf, boleh saya tahu anggaran masa? Saya sedang menyusun rancangan."
  ],
    leaving: [
    "Saya perlu kembali kepada Tsukasa. Maaf, saya pergi dulu.",
    "Nampaknya saya tak sempat menunggu lagi. Terima kasih.",
    "Saya perlu bergerak sekarang. Mungkin kami datang semula."
  ]
  },
  "yuzaki-tsukasa": {
    anime: "TONIKAWA: Over The Moon For You",
    personality: "Cool-headed and independent, with understated humor and a caring domestic side. Official material gives limited speech detail, so these are restrained originals rather than catchphrase imitation.",
    references: ["https://tonikawa.com/character/", "https://www.aniplus-asia.com/show/tonikawa-over-the-moon-for-you/", "https://subs.yakuaru.com/books/tonikawa-over-the-moon-for-you/page/e6-underneath-the-moon"],
    greetingOrder: variants(
      [
      "Hai. Tempat ini nampak selesa. Boleh kami duduk?",
      "Hello. Saya tertarik dengan bau dari dapur.",
      "Selamat petang. Nasa, kita patut cuba tempat ini.",
      "Hai. Saya cuma mahu makan sesuatu yang ringkas.",
      "Oh, hello. Kedai ini nampak agak tenang."
    ],
      [
      "Saya mahu {food_item} dengan {drink_item}. Itu sudah cukup.",
      "Saya pesan {food_item} dan {drink_item}. Nasa, jangan kira masa pula.",
      "Boleh sediakan {food_item} bersama {drink_item}? Terima kasih.",
      "Saya ambil {food_item} dan {drink_item}. Nampak sedap.",
      "Untuk saya, {food_item} dengan {drink_item}. Ringkas saja."
    ]
    ),
    waiting: [
    "Tak mengapa, kita boleh tunggu sedikit lagi.",
    "Nasa, jangan risau sangat. Makanan akan siap juga nanti.",
    "Hmm, saya mula lapar. Harap tak lama lagi."
  ],
    leaving: [
    "Kita pergi saja. Saya dah mula lapar.",
    "Cukup lama menunggu. Kita cari tempat lain, Nasa.",
    "Saya rasa kita patut beredar. Terima kasih."
  ]
  },
  "zenin-maki": {
    anime: "Jujutsu Kaisen",
    personality: "Blunt, disciplined, and determined to prove herself through hard work. Her everyday speech is direct and practical, with little patience for fuss or special treatment.",
    references: ["https://jujutsukaisen.jp/character/", "https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin", "https://subs.yakuaru.com/books/jujutsu-kaisen/page/m1-jujutsu-kaisen-0"],
    greetingOrder: variants(
      [
      "Oi, hai. Masih boleh pesan?",
      "Hey. Aku baru habis latihan. Tunjuk menu yang ada.",
      "Selamat petang. Aku nak makan sebelum sambung latihan.",
      "Hello. Tempat ni nampak okay. Ada meja kosong?",
      "Hai. Aku tak perlukan layanan khas. Aku cuma nak makan."
    ],
      [
      "Aku nak {food_item} dengan {drink_item}. Itu saja.",
      "Bagi aku {food_item} dan {drink_item}. Buat cepat kalau boleh.",
      "Aku ambil {food_item} sekali {drink_item}. Pastikan betul.",
      "Catat {food_item} dengan {drink_item}. Aku makan sini.",
      "{food_item} dan {drink_item}. Tak perlu tambah apa-apa."
    ]
    ),
    waiting: [
    "Aku boleh tunggu sedikit. Tak perlu kelam-kabut.",
    "Dah agak lama. Pesanan aku masih dibuat, kan?",
    "Teruskan kerja. Aku masih ada masa, buat masa ni."
  ],
    leaving: [
    "Cukup. Aku pergi dulu.",
    "Aku tak boleh buang masa lagi. Cari tempat lain sajalah.",
    "Aku kena sambung latihan. Batalkan pesanan aku."
  ]
  }
};
