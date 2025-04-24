enum ChannelType {
    Közszolgálati = 'Közszolgálati',
    Sport = 'Sport',
    Zene = 'Zene',
    UNKNOWN = 'UNKNOWN',
    Film = 'Film',
    Gyerek = 'Gyerek',
    Ismeretterjesztő = 'Ismeretterjesztő',
    Szórakoztató = 'Szórakoztató',
    Híradó = 'Híradó',
    Dokumentum = 'Dokumentum',
    SzórakoztatóFilm = 'SzórakoztatóFilm',
    Gasztronómia = 'Gasztronómia',
  }

export const list: {channel: number, name: string, type: ChannelType, id?: string}[] = [
    { channel: 2, name: 'M1', type: ChannelType.Közszolgálati, id: 'tvchannel-1' }, // Matches "m1"
    { channel: 4, name: 'M2', type: ChannelType.Közszolgálati, id: 'tvchannel-2' }, // Matches "m2 / Petőfi TV"
    { channel: 6, name: 'Duna', type: ChannelType.Közszolgálati, id: 'tvchannel-6' }, // Matches "DUNA Televízió"
    { channel: 8, name: 'M4', type: ChannelType.Sport, id: 'tvchannel-290' }, // Matches "M4 Sport"
    { channel: 10, name: 'DunaTV', type: ChannelType.Közszolgálati, id: 'tvchannel-103' }, // Matches "Duna World"
    { channel: 12, name: 'M5', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-301' }, // Matches "M5"
    { channel: 14, name: 'Promóció 1', type: ChannelType.UNKNOWN },
    { channel: 15, name: 'Promóció 2', type: ChannelType.UNKNOWN },
    { channel: 16, name: 'Promóció 3', type: ChannelType.UNKNOWN },
    { channel: 18, name: 'Info csatorna 1', type: ChannelType.UNKNOWN },
    { channel: 19, name: 'Info csatorna 2', type: ChannelType.UNKNOWN },
    { channel: 21, name: 'VOD', type: ChannelType.UNKNOWN },
    { channel: 22, name: 'Hangulat', type: ChannelType.Szórakoztató },
    { channel: 23, name: 'TV4', type: ChannelType.Szórakoztató, id: 'tvchannel-38' }, // Matches "TV4"
    { channel: 25, name: 'Comedy Central', type: ChannelType.Szórakoztató, id: 'tvchannel-194' }, // Matches "Comedy Central"
    { channel: 27, name: 'Comedy Central HD', type: ChannelType.Szórakoztató, id: 'tvchannel-194' }, // Maps to same "Comedy Central"
    { channel: 29, name: 'Paramount Network', type: ChannelType.Film, id: 'tvchannel-257' }, // Matches "Paramount Network"
    { channel: 34, name: 'TV2 HD', type: ChannelType.Szórakoztató, id: 'tvchannel-3' }, // Matches "TV2"
    { channel: 35, name: 'Viasat 3', type: ChannelType.Szórakoztató, id: 'tvchannel-21' }, // Matches "VIASAT3"
    { channel: 36, name: 'Viasat 3 HD', type: ChannelType.Szórakoztató, id: 'tvchannel-21' }, // Maps to same "VIASAT3"
    { channel: 37, name: 'Viasat 6', type: ChannelType.Szórakoztató, id: 'tvchannel-164' }, // Matches "VIASAT6"
    { channel: 39, name: 'TV2 HD', type: ChannelType.Szórakoztató, id: 'tvchannel-3' }, // Maps to same "TV2"
    { channel: 40, name: 'Moziverzum', type: ChannelType.Film, id: 'tvchannel-365' }, // Matches "Moziverzum"
    { channel: 41, name: 'Moziverzum HD', type: ChannelType.Film, id: 'tvchannel-365' }, // Maps to same "Moziverzum"
    { channel: 43, name: 'Filmplusz HD', type: ChannelType.Film, id: 'tvchannel-32' }, // Matches "Film+" (Filmplusz is a variant)
    { channel: 44, name: 'Moziplusz HD', type: ChannelType.Film, id: 'tvchannel-229' }, // Matches "Mozi+"
    { channel: 45, name: 'Moziklub', type: ChannelType.Film, id: 'tvchannel-380' }, // Matches "Mozi Klub"
    { channel: 46, name: 'CoolTV HD', type: ChannelType.Szórakoztató, id: 'tvchannel-79' }, // Matches "Cool"
    { channel: 48, name: 'Sorozat+', type: ChannelType.Szórakoztató, id: 'tvchannel-179' }, // Matches "Sorozat+"
    { channel: 49, name: 'RTL Gold', type: ChannelType.Közszolgálati, id: 'tvchannel-180' }, // Matches "RTL GOLD"
    { channel: 50, name: 'AXN HD', type: ChannelType.Szórakoztató, id: 'tvchannel-42' }, // Matches "AXN"
    { channel: 51, name: 'AXN', type: ChannelType.Szórakoztató, id: 'tvchannel-42' }, // Maps to same "AXN"
    { channel: 52, name: 'Viasat Film', type: ChannelType.Film, id: 'tvchannel-138' }, // Matches "VIASAT FILM"
    { channel: 53, name: 'Viasat 2', type: ChannelType.Szórakoztató, id: 'tvchannel-132' }, // Matches "VIASAT2"
    { channel: 54, name: 'JokiTV', type: ChannelType.Gyerek, id: 'tvchannel-364' }, // Matches "Jocky TV" (likely a typo or variant)
    { channel: 55, name: 'IzauraTV', type: ChannelType.Szórakoztató, id: 'tvchannel-304' }, // Matches "Izaura TV"
    { channel: 56, name: 'Filmbox HD', type: ChannelType.Film, id: 'tvchannel-226' }, // Matches "Filmbox"
    { channel: 78, name: 'Magyar Mozitv', type: ChannelType.Film, id: 'tvchannel-377' }, // Matches "Magyar Mozi TV"
    { channel: 79, name: 'Sorozatklub', type: ChannelType.Szórakoztató, id: 'tvchannel-382' }, // Matches "Sorozat Klub"
    { channel: 82, name: 'Max 4', type: ChannelType.Szórakoztató, id: 'tvchannel-376' }, // Matches "Max4"
    { channel: 83, name: 'Galaxy 4', type: ChannelType.Szórakoztató, id: 'tvchannel-284' }, // Matches "Galaxy4"
    { channel: 84, name: 'Galaxy 4 HD', type: ChannelType.Szórakoztató, id: 'tvchannel-284' }, // Maps to same "Galaxy4"
    { channel: 85, name: 'Epic Drama HD', type: ChannelType.Szórakoztató, id: 'tvchannel-325' }, // Matches "Epic Drama"
    { channel: 86, name: 'Film 4 HD', type: ChannelType.Film, id: 'tvchannel-359' }, // Matches "Film4"
    { channel: 87, name: 'Film 4', type: ChannelType.Film, id: 'tvchannel-359' }, // Maps to same "Film4"
    { channel: 88, name: 'ATV Spirit HD', type: ChannelType.Szórakoztató, id: 'tvchannel-363' }, // Matches "ATV Spirit"
    { channel: 91, name: 'ATV HD', type: ChannelType.Szórakoztató, id: 'tvchannel-15' }, // Matches "ATV"
    { channel: 93, name: 'HIR TV HD', type: ChannelType.Híradó, id: 'tvchannel-10' }, // Matches "Hír TV"
    { channel: 94, name: 'Euronews HD', type: ChannelType.Híradó, id: 'tvchannel-71' }, // Matches "Euronews"
    { channel: 102, name: 'HBO HD', type: ChannelType.Film, id: 'tvchannel-8' }, // Matches "HBO"
    { channel: 103, name: 'HBO 2 HD', type: ChannelType.Film, id: 'tvchannel-59' }, // Matches "HBO 2"
    { channel: 104, name: 'HBO 3 HD', type: ChannelType.Film, id: 'tvchannel-143' }, // Matches "HBO 3"
    { channel: 105, name: 'Cinema HD', type: ChannelType.Film, id: 'tvchannel-47' }, // Matches "Cinemax"
    { channel: 106, name: 'Cinemax 2 HD', type: ChannelType.Film, id: 'tvchannel-60' }, // Matches "Cinemax 2"
    { channel: 121, name: 'Filmbox Extra HD', type: ChannelType.Film, id: 'tvchannel-173' }, // Matches "Filmbox Extra HD"
    { channel: 122, name: 'Filmbox Premium', type: ChannelType.Film, id: 'tvchannel-177' }, // Matches "Filmbox Premium"
    { channel: 123, name: 'Filmbox Family', type: ChannelType.Gyerek, id: 'tvchannel-227' }, // Matches "Filmbox Family"
    { channel: 124, name: 'Filmbox Stars', type: ChannelType.Film }, // No match (likely "Filmbox Plus" but not exact)
    { channel: 125, name: 'Fightbox', type: ChannelType.Sport },
    { channel: 126, name: 'DokuBox', type: ChannelType.Ismeretterjesztő },
    { channel: 127, name: 'GameToon', type: ChannelType.Szórakoztató },
    { channel: 151, name: 'Spíler 1 TV HD', type: ChannelType.Sport, id: 'tvchannel-305' }, // Matches "Spíler1 TV"
    { channel: 152, name: 'Sport 1 HD', type: ChannelType.Sport, id: 'tvchannel-90' }, // Matches "Sport1"
    { channel: 153, name: 'Spíler 2 TV HD', type: ChannelType.Sport, id: 'tvchannel-362' }, // Matches "Spíler2 TV"
    { channel: 154, name: 'Sport 2 HD', type: ChannelType.Sport, id: 'tvchannel-44' }, // Matches "Sport2"
    { channel: 162, name: 'The Hunting and Fishing', type: ChannelType.Sport, id: 'tvchannel-176' }, // Matches "Fishing & Hunting"
    { channel: 165, name: 'Arena 4 HD', type: ChannelType.Sport, id: 'tvchannel-370' }, // Matches "Aréna 4"
    { channel: 166, name: 'Match 4 HD', type: ChannelType.Sport, id: 'tvchannel-375' }, // Matches "Match4"
    { channel: 202, name: 'Spectrum HD', type: ChannelType.Zene, id: 'tvchannel-9' }, // Matches "Spektrum"
    { channel: 203, name: 'BBC Earth', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-251' }, // Matches "BBC Earth"
    { channel: 204, name: 'BBC Earth HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-251' }, // Maps to same "BBC Earth"
    { channel: 205, name: 'Natgeo Wild HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-294' }, // Matches "National Geographic Wild HD"
    { channel: 206, name: 'Natgeo HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-159' }, // Matches "Nat Geo HD"
    { channel: 207, name: 'Discovery Channel', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-83' }, // Matches "Discovery Channel"
    { channel: 208, name: 'Discovery Channel HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-83' }, // Maps to same "Discovery Channel"
    { channel: 210, name: 'Animal Planet', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-82' }, // Matches "Animal Planet"
    { channel: 211, name: 'HGTV', type: ChannelType.Szórakoztató, id: 'tvchannel-397' }, // Matches "HGTV"
    { channel: 212, name: 'HGTV HD', type: ChannelType.Szórakoztató, id: 'tvchannel-397' }, // Maps to same "HGTV"
    { channel: 213, name: 'RTL Otthon HD', type: ChannelType.Szórakoztató, id: 'tvchannel-381' }, // Matches "RTL Otthon"
    { channel: 214, name: 'TLC', type: ChannelType.Szórakoztató, id: 'tvchannel-233' }, // Matches "TLC"
    { channel: 215, name: 'IDHD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-279' }, // Matches "Investigation Discovery"
    { channel: 216, name: 'History HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-182' }, // Matches "HISTORY"
    { channel: 217, name: 'Ozone TV HD', type: ChannelType.Szórakoztató, id: 'tvchannel-213' }, // Matches "OzoneTv"
    { channel: 218, name: 'Fashion TV', type: ChannelType.Szórakoztató, id: 'tvchannel-368' }, // Matches "Fashion TV"
    { channel: 219, name: 'Viasat Explorer', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-65' }, // Matches "Viasat Explore"
    { channel: 220, name: 'Viasat Explorer HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-65' }, // Maps to same "Viasat Explore"
    { channel: 221, name: 'Viasat History HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-66' }, // Matches "Viasat History"
    { channel: 222, name: 'Viasat Nature HD', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-223' }, // Matches "Viasat Nature"
    { channel: 223, name: 'Travel HD', type: ChannelType.Szórakoztató, id: 'tvchannel-84' }, // Matches "Travel Channel"
    { channel: 225, name: 'Live TV HD', type: ChannelType.Szórakoztató },
    { channel: 251, name: 'TV Paprika HD', type: ChannelType.Gasztronómia, id: 'tvchannel-46' }, // Matches "TV Paprika"
    { channel: 252, name: 'Spectrum Home', type: ChannelType.Zene, id: 'tvchannel-20' }, // Matches "Spektrum Home"
    { channel: 253, name: 'Spectrum Home HD', type: ChannelType.Zene, id: 'tvchannel-20' }, // Maps to same "Spektrum Home"
    { channel: 254, name: 'TV2 SÉF', type: ChannelType.Gasztronómia, id: 'tvchannel-309' }, // Matches "TV2 Séf"
    { channel: 255, name: 'Food network HD', type: ChannelType.Gasztronómia, id: 'tvchannel-285' }, // Matches "Food Network"
    { channel: 257, name: 'TV2 Klub', type: ChannelType.Közszolgálati, id: 'tvchannel-307' }, // Matches "TV2 Klub"
    { channel: 259, name: 'Da Vinci', type: ChannelType.Ismeretterjesztő, id: 'tvchannel-202' }, // Matches "Da Vinci TV"
    { channel: 302, name: 'Disney Channel', type: ChannelType.Gyerek, id: 'tvchannel-35' }, // Matches "Disney Channel"
    { channel: 304, name: 'Nickelodeon', type: ChannelType.Gyerek, id: 'tvchannel-41' }, // Matches "Nickelodeon"
    { channel: 305, name: 'TeenNick', type: ChannelType.Gyerek, id: 'tvchannel-374' }, // Matches "TeenNick"
    { channel: 306, name: 'Nick Jr.', type: ChannelType.Gyerek, id: 'tvchannel-236' }, // Matches "Nick Jr."
    { channel: 307, name: 'Minimax', type: ChannelType.Gyerek, id: 'tvchannel-16' }, // Matches "Minimax"
    { channel: 308, name: 'Cartoonito', type: ChannelType.Gyerek, id: 'tvchannel-77' }, // Matches "Cartoonito"
    { channel: 309, name: 'Cartoon Network', type: ChannelType.Gyerek, id: 'tvchannel-91' }, // Matches "Cartoon Network"
    { channel: 310, name: 'Jim Jam', type: ChannelType.Gyerek, id: 'tvchannel-197' }, // Matches "JimJam"
    { channel: 311, name: 'Baby TV', type: ChannelType.Gyerek, id: 'tvchannel-153' }, // Matches "Baby TV (English)"
    { channel: 312, name: 'TV2 Kids', type: ChannelType.Gyerek, id: 'tvchannel-310' }, // Matches "TV2 Kids"
    { channel: 313, name: 'Nicktoons HD', type: ChannelType.Gyerek, id: 'tvchannel-366' }, // Matches "Nicktoons"
    { channel: 314, name: 'Nicktoons', type: ChannelType.Gyerek, id: 'tvchannel-366' }, // Maps to same "Nicktoons"
    { channel: 315, name: 'Club HD', type: ChannelType.Szórakoztató },
    { channel: 351, name: 'Mezzo HD', type: ChannelType.Zene, id: 'tvchannel-80' }, // Matches "Mezzo"
    { channel: 352, name: 'Mezzo', type: ChannelType.Zene, id: 'tvchannel-80' }, // Maps to same "Mezzo"
    { channel: 353, name: 'Muzsika TV', type: ChannelType.Zene, id: 'tvchannel-217' }, // Matches "Muzsika TV"
    { channel: 354, name: 'TV Boutique', type: ChannelType.Szórakoztató },
    { channel: 355, name: 'MTV Hits', type: ChannelType.Zene },
    { channel: 356, name: 'MTV European', type: ChannelType.Zene, id: 'tvchannel-144' }, // Matches "MTV"
    { channel: 357, name: 'MTV 90s', type: ChannelType.Zene },
    { channel: 358, name: 'MTV Live HD', type: ChannelType.Zene },
    { channel: 359, name: 'MTV 00', type: ChannelType.Zene },
    { channel: 360, name: 'Magyar Slugger TV', type: ChannelType.Sport },
    { channel: 361, name: 'Dick TV', type: ChannelType.Szórakoztató },
    { channel: 401, name: 'CNN', type: ChannelType.Híradó, id: 'tvchannel-4' }, // Matches "CNN (English)"
    { channel: 402, name: 'BBC News', type: ChannelType.Híradó, id: 'tvchannel-126' }, // Matches "BBC World"
    { channel: 404, name: 'English Club HD', type: ChannelType.Ismeretterjesztő },
    { channel: 406, name: 'TV5 Monde', type: ChannelType.Közszolgálati, id: 'tvchannel-23' }, // Matches "TV5MONDE"
    { channel: 408, name: 'ZDF', type: ChannelType.Közszolgálati },
    { channel: 413, name: 'ORF2', type: ChannelType.Közszolgálati },
    { channel: 414, name: 'RAI Uno', type: ChannelType.Közszolgálati, id: 'tvchannel-373' }, // Matches "RAI 1"
    { channel: 416, name: 'CCTV4', type: ChannelType.Közszolgálati },
    { channel: 452, name: 'Hustler TV', type: ChannelType.UNKNOWN },
    { channel: 453, name: 'Private', type: ChannelType.UNKNOWN },
    { channel: 454, name: 'SuperOne HD', type: ChannelType.UNKNOWN },
    { channel: 455, name: 'EURO XXX', type: ChannelType.UNKNOWN },
    { channel: 501, name: 'Új Buda TV', type: ChannelType.Szórakoztató },
    { channel: 502, name: 'TV2040', type: ChannelType.Szórakoztató },
    { channel: 503, name: 'BKTV', type: ChannelType.Szórakoztató },
    { channel: 504, name: 'Vörgyhíd TV', type: ChannelType.Szórakoztató },
    { channel: 505, name: 'Kispest TV', type: ChannelType.Szórakoztató },
    { channel: 506, name: 'TV13', type: ChannelType.Szórakoztató },
    { channel: 507, name: 'Kilenc TV', type: ChannelType.Szórakoztató },
    { channel: 508, name: 'Centrum TV', type: ChannelType.Szórakoztató },
    { channel: 509, name: 'XV.tv', type: ChannelType.Szórakoztató },
    { channel: 510, name: 'TV10', type: ChannelType.Szórakoztató },
    { channel: 511, name: 'TV16', type: ChannelType.Szórakoztató },
    { channel: 512, name: 'Rákospente TV', type: ChannelType.Szórakoztató },
    { channel: 513, name: 'TV18', type: ChannelType.Szórakoztató },
    { channel: 514, name: 'Hegyvidék TV', type: ChannelType.Szórakoztató },
    { channel: 515, name: 'Zugló TV', type: ChannelType.Szórakoztató },
    { channel: 516, name: 'Hunyadi TV', type: ChannelType.Szórakoztató },
    { channel: 517, name: 'Williams TV', type: ChannelType.Szórakoztató },
    { channel: 518, name: 'Signals TV', type: ChannelType.Szórakoztató },
    { channel: 519, name: 'Régióplusz TV', type: ChannelType.Szórakoztató },
    { channel: 520, name: 'Szilas TV', type: ChannelType.Szórakoztató },
    { channel: 552, name: 'Pax TV', type: ChannelType.Közszolgálati, id: 'tvchannel-115' }, // Matches "PAX Tv"
    { channel: 553, name: 'EWTN', type: ChannelType.Közszolgálati, id: 'tvchannel-275' }, // Matches "EWTN"
    { channel: 556, name: 'Heti TV', type: ChannelType.Szórakoztató, id: 'tvchannel-313' }, // Matches "Heti TV"
    { channel: 558, name: 'Jazz TV', type: ChannelType.Zene },
    { channel: 560, name: 'Apostol TV', type: ChannelType.Zene, id: 'tvchannel-371' }, // Matches "Apostol TV"
    { channel: 801, name: 'Kossuth Radio', type: ChannelType.Közszolgálati },
    { channel: 802, name: 'Petőfi Radio', type: ChannelType.Közszolgálati },
    { channel: 803, name: 'Bartók Radio', type: ChannelType.Közszolgálati }
];