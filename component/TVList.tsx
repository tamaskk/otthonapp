import React, { useEffect, useMemo, useState } from 'react'

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

  type Channel = {
    channel: number
    name: string
    type: ChannelType
  }

  const list: {channel: number, name: string, type: ChannelType}[] = [
    { channel: 2, name: 'M1', type: ChannelType.Közszolgálati },
    { channel: 4, name: 'M2', type: ChannelType.Közszolgálati },
    { channel: 6, name: 'Duna', type: ChannelType.Közszolgálati },
    { channel: 8, name: 'M4', type: ChannelType.Sport },
    { channel: 10, name: 'DunaTV', type: ChannelType.Közszolgálati },
    { channel: 12, name: 'M5', type: ChannelType.Ismeretterjesztő },
    { channel: 14, name: 'Promóció 1', type: ChannelType.UNKNOWN },
    { channel: 15, name: 'Promóció 2', type: ChannelType.UNKNOWN },
    { channel: 16, name: 'Promóció 3', type: ChannelType.UNKNOWN },
    { channel: 18, name: 'Info csatorna 1', type: ChannelType.UNKNOWN },
    { channel: 19, name: 'Info csatorna 2', type: ChannelType.UNKNOWN },
    { channel: 21, name: 'VOD', type: ChannelType.UNKNOWN },
    { channel: 22, name: 'Hangulat', type: ChannelType.Szórakoztató },
    { channel: 23, name: 'TV4', type: ChannelType.Szórakoztató },
    { channel: 25, name: 'Comedy Central', type: ChannelType.Szórakoztató },
    { channel: 27, name: 'Comedy Central HD', type: ChannelType.Szórakoztató },
    { channel: 29, name: 'Paramount Network', type: ChannelType.Film },
    { channel: 34, name: 'TV2 HD', type: ChannelType.Szórakoztató },
    { channel: 35, name: 'Viasat 3', type: ChannelType.Szórakoztató },
    { channel: 36, name: 'Viasat 3 HD', type: ChannelType.Szórakoztató },
    { channel: 37, name: 'Viasat 6', type: ChannelType.Szórakoztató },
    { channel: 39, name: 'TV2 HD', type: ChannelType.Szórakoztató },
    { channel: 40, name: 'Moziverzum', type: ChannelType.Film },
    { channel: 41, name: 'Moziverzum HD', type: ChannelType.Film },
    { channel: 43, name: 'Filmplusz HD', type: ChannelType.Film },
    { channel: 44, name: 'Moziplusz HD', type: ChannelType.Film },
    { channel: 45, name: 'Moziklub', type: ChannelType.Film },
    { channel: 46, name: 'CoolTV HD', type: ChannelType.Szórakoztató },
    { channel: 48, name: 'Sorozat+', type: ChannelType.Szórakoztató },
    { channel: 49, name: 'RTL Gold', type: ChannelType.Közszolgálati },
    { channel: 50, name: 'AXN HD', type: ChannelType.Szórakoztató },
    { channel: 51, name: 'AXN', type: ChannelType.Szórakoztató },
    { channel: 52, name: 'Viasat Film', type: ChannelType.Film },
    { channel: 53, name: 'Viasat 2', type: ChannelType.Szórakoztató },
    { channel: 54, name: 'JokiTV', type: ChannelType.Gyerek },
    { channel: 55, name: 'IzauraTV', type: ChannelType.Szórakoztató },
    { channel: 56, name: 'Filmbox HD', type: ChannelType.Film },
    { channel: 78, name: 'Magyar Mozitv', type: ChannelType.Film },
    { channel: 79, name: 'Sorozatklub', type: ChannelType.Szórakoztató },
    { channel: 82, name: 'Max 4', type: ChannelType.Szórakoztató },
    { channel: 83, name: 'Galaxy 4', type: ChannelType.Szórakoztató },
    { channel: 84, name: 'Galaxy 4 HD', type: ChannelType.Szórakoztató },
    { channel: 85, name: 'Epic Drama HD', type: ChannelType.Szórakoztató },
    { channel: 86, name: 'Film 4 HD', type: ChannelType.Film },
    { channel: 87, name: 'Film 4', type: ChannelType.Film },
    { channel: 88, name: 'ATV Spirit HD', type: ChannelType.Szórakoztató },
    { channel: 91, name: 'ATV HD', type: ChannelType.Szórakoztató },
    { channel: 93, name: 'HIR TV HD', type: ChannelType.Híradó },
    { channel: 94, name: 'Euronews HD', type: ChannelType.Híradó },
    { channel: 102, name: 'HBO HD', type: ChannelType.Film },
    { channel: 103, name: 'HBO 2 HD', type: ChannelType.Film },
    { channel: 104, name: 'HBO 3 HD', type: ChannelType.Film },
    { channel: 105, name: 'Cinema HD', type: ChannelType.Film },
    { channel: 106, name: 'Cinemax 2 HD', type: ChannelType.Film },
    { channel: 121, name: 'Filmbox Extra HD', type: ChannelType.Film },
    { channel: 122, name: 'Filmbox Premium', type: ChannelType.Film },
    { channel: 123, name: 'Filmbox Family', type: ChannelType.Gyerek },
    { channel: 124, name: 'Filmbox Stars', type: ChannelType.Film },
    { channel: 125, name: 'Fightbox', type: ChannelType.Sport },
    { channel: 126, name: 'DokuBox', type: ChannelType.Ismeretterjesztő },
    { channel: 127, name: 'GameToon', type: ChannelType.Szórakoztató },
    { channel: 151, name: 'Spíler 1 TV HD', type: ChannelType.Sport },
    { channel: 152, name: 'Sport 1 HD', type: ChannelType.Sport },
    { channel: 153, name: 'Spíler 2 TV HD', type: ChannelType.Sport },
    { channel: 154, name: 'Sport 2 HD', type: ChannelType.Sport },
    { channel: 162, name: 'The Hunting and Fishing', type: ChannelType.Sport },
    { channel: 165, name: 'Arena 4 HD', type: ChannelType.Sport },
    { channel: 166, name: 'Match 4 HD', type: ChannelType.Sport },
    { channel: 202, name: 'Spectrum HD', type: ChannelType.Zene },
    { channel: 203, name: 'BBC Earth', type: ChannelType.Ismeretterjesztő },
    { channel: 204, name: 'BBC Earth HD', type: ChannelType.Ismeretterjesztő },
    { channel: 205, name: 'Natgeo Wild HD', type: ChannelType.Ismeretterjesztő },
    { channel: 206, name: 'Natgeo HD', type: ChannelType.Ismeretterjesztő },
    { channel: 207, name: 'Discovery Channel', type: ChannelType.Ismeretterjesztő },
    { channel: 208, name: 'Discovery Channel HD', type: ChannelType.Ismeretterjesztő },
    { channel: 210, name: 'Animal Planet', type: ChannelType.Ismeretterjesztő },
    { channel: 211, name: 'HGTV', type: ChannelType.Szórakoztató },
    { channel: 212, name: 'HGTV HD', type: ChannelType.Szórakoztató },
    { channel: 213, name: 'RTL Otthon HD', type: ChannelType.Szórakoztató },
    { channel: 214, name: 'TLC', type: ChannelType.Szórakoztató },
    { channel: 215, name: 'IDHD', type: ChannelType.Ismeretterjesztő },
    { channel: 216, name: 'History HD', type: ChannelType.Ismeretterjesztő },
    { channel: 217, name: 'Ozone TV HD', type: ChannelType.Szórakoztató },
    { channel: 218, name: 'Fashion TV', type: ChannelType.Szórakoztató },
    { channel: 219, name: 'Viasat Explorer', type: ChannelType.Ismeretterjesztő },
    { channel: 220, name: 'Viasat Explorer HD', type: ChannelType.Ismeretterjesztő },
    { channel: 221, name: 'Viasat History HD', type: ChannelType.Ismeretterjesztő },
    { channel: 222, name: 'Viasat Nature HD', type: ChannelType.Ismeretterjesztő },
    { channel: 223, name: 'Travel HD', type: ChannelType.Szórakoztató },
    { channel: 225, name: 'Live TV HD', type: ChannelType.Szórakoztató },
    { channel: 251, name: 'TV Paprika HD', type: ChannelType.Gasztronómia },
    { channel: 252, name: 'Spectrum Home', type: ChannelType.Zene },
    { channel: 253, name: 'Spectrum Home HD', type: ChannelType.Zene },
    { channel: 254, name: 'TV2 SÉF', type: ChannelType.Gasztronómia },
    { channel: 255, name: 'Food network HD', type: ChannelType.Gasztronómia },
    { channel: 257, name: 'TV2 Klub', type: ChannelType.Közszolgálati },
    { channel: 259, name: 'Da Vinci', type: ChannelType.Ismeretterjesztő },
    { channel: 302, name: 'Disney Channel', type: ChannelType.Gyerek },
    { channel: 304, name: 'Nickelodeon', type: ChannelType.Gyerek },
    { channel: 305, name: 'TeenNick', type: ChannelType.Gyerek },
    { channel: 306, name: 'Nick Jr.', type: ChannelType.Gyerek },
    { channel: 307, name: 'Minimax', type: ChannelType.Gyerek },
    { channel: 308, name: 'Cartoonito', type: ChannelType.Gyerek },
    { channel: 309, name: 'Cartoon Network', type: ChannelType.Gyerek },
    { channel: 310, name: 'Jim Jam', type: ChannelType.Gyerek },
    { channel: 311, name: 'Baby TV', type: ChannelType.Gyerek },
    { channel: 312, name: 'TV2 Kids', type: ChannelType.Gyerek },
    { channel: 313, name: 'Nicktoons HD', type: ChannelType.Gyerek },
    { channel: 314, name: 'Nicktoons', type: ChannelType.Gyerek },
    { channel: 315, name: 'Club HD', type: ChannelType.Szórakoztató },
    { channel: 351, name: 'Mezzo HD', type: ChannelType.Zene },
    { channel: 352, name: 'Mezzo', type: ChannelType.Zene },
    { channel: 353, name: 'Muzsika TV', type: ChannelType.Zene },
    { channel: 354, name: 'TV Boutique', type: ChannelType.Szórakoztató },
    { channel: 355, name: 'MTV Hits', type: ChannelType.Zene },
    { channel: 356, name: 'MTV European', type: ChannelType.Zene },
    { channel: 357, name: 'MTV 90s', type: ChannelType.Zene },
    { channel: 358, name: 'MTV Live HD', type: ChannelType.Zene },
    { channel: 359, name: 'MTV 00', type: ChannelType.Zene },
    { channel: 360, name: 'Magyar Slugger TV', type: ChannelType.Sport },
    { channel: 361, name: 'Dick TV', type: ChannelType.Szórakoztató },
    { channel: 401, name: 'CNN', type: ChannelType.Híradó },
    { channel: 402, name: 'BBC News', type: ChannelType.Híradó },
    { channel: 404, name: 'English Club HD', type: ChannelType.Ismeretterjesztő },
    { channel: 406, name: 'TV5 Monde', type: ChannelType.Közszolgálati },
    { channel: 408, name: 'ZDF', type: ChannelType.Közszolgálati },
    { channel: 413, name: 'ORF2', type: ChannelType.Közszolgálati },
    { channel: 414, name: 'RAI Uno', type: ChannelType.Közszolgálati },
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
    { channel: 552, name: 'Pax TV', type: ChannelType.Közszolgálati },
    { channel: 553, name: 'EWTN', type: ChannelType.Közszolgálati },
    { channel: 556, name: 'Heti TV', type: ChannelType.Szórakoztató },
    { channel: 558, name: 'Jazz TV', type: ChannelType.Zene },
    { channel: 560, name: 'Apostol TV', type: ChannelType.Zene },
    { channel: 801, name: 'Kossuth Radio', type: ChannelType.Közszolgálati },
    { channel: 802, name: 'Petőfi Radio', type: ChannelType.Közszolgálati },
    { channel: 803, name: 'Bartók Radio', type: ChannelType.Közszolgálati }
  ]

  const TVList = () => {
    const [viewType, setViewType] = useState<'all' | 'type'>('type')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState<ChannelType | ''>('')


    // useEffect(() => {
    //   fetch("/api/porthu?channels=2&channels=27") // TV2 és M4 Sport
    //     .then(res => res.json())
    //     .then(data => {
    //       console.log("Műsor adatok:", data);
    //     });
    // }, []);
  
    const filteredList = useMemo(() => {
      return list.filter((channel) => {
        const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = searchType ? channel.type === searchType : true
        return matchesSearch && matchesType
      })
    }, [searchTerm, searchType])
  
    const groupByType = (channels: Channel[]) => {
      return channels.reduce<Record<ChannelType, Channel[]>>((acc, curr) => {
        if (!acc[curr.type]) acc[curr.type] = []
        acc[curr.type].push(curr)
        return acc
      }, {} as Record<ChannelType, Channel[]>)
    }
  
    const grouped = useMemo(() => groupByType(filteredList), [filteredList])
  
    return (
      <div className="p-4 text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          TV csatornák
        </h1>
  
        <div>
          <input
            type="text"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mb-4 rounded w-full"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as ChannelType)}
            className="border p-2 mb-4 rounded w-full"
          >
            <option value="">Összes típus</option>
            {Object.values(ChannelType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <button
            className={`mr-2 px-3 py-1 rounded ${viewType === 'type' ? 'font-bold bg-gray-200' : ''}`}
            onClick={() => setViewType('type')}
          >
            Típus szerint
          </button>
          <button
            className={`px-3 py-1 rounded ${viewType === 'all' ? 'font-bold bg-gray-200' : ''}`}
            onClick={() => setViewType('all')}
          >
            Összes csatorna
          </button>
        </div>
  
        {viewType === 'type' ? (
          Object.entries(grouped).map(([type, channels]) => (
            <div key={type} className="mb-6">
              <h2 className="text-xl font-bold mb-2">{type}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {channels
                  .sort((a, b) => a.channel - b.channel)
                  .map(({ channel, name }) => (
                    <li key={channel} className="border p-2 rounded shadow-sm">
                      <strong>{channel}</strong> – {name}
                    </li>
                  ))}
              </ul>
            </div>
          ))
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredList
              .sort((a, b) => a.channel - b.channel)
              .map(({ channel, name, type }) => (
                <li key={channel} className="border p-2 rounded shadow-sm">
                  <strong>{channel}</strong> – {name} ({type})
                </li>
              ))}
          </ul>
        )}
      </div>
    )
  }

  export default TVList