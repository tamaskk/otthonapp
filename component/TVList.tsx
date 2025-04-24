import React, { useEffect, useMemo, useState } from "react";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Modal from "./Modal";
import { list } from "@/db/TVList";

enum ChannelType {
  Közszolgálati = "Közszolgálati",
  Sport = "Sport",
  Zene = "Zene",
  UNKNOWN = "UNKNOWN",
  Film = "Film",
  Gyerek = "Gyerek",
  Ismeretterjesztő = "Ismeretterjesztő",
  Szórakoztató = "Szórakoztató",
  Híradó = "Híradó",
  Dokumentum = "Dokumentum",
  SzórakoztatóFilm = "SzórakoztatóFilm",
  Gasztronómia = "Gasztronómia",
}

type Channel = {
  channel: number;
  name: string;
  type: ChannelType;
  id?: string;
};

const formatDateTime = (isoString: string, type: "date" | "time"): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";

  if (type === "date") {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } else {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
};

const TVList = () => {
  const [viewType, setViewType] = useState<"all" | "type">("type");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<ChannelType | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [addDate, setAddDate] = useState(3);
  const [choosenChannel, setChoosenChannel] = useState<any>(null);

  useEffect(() => {
    const getPortApiList = async () => {
      try {
        const response = await fetch("https://port.hu/tvapi/init-new");
        const data = await response.json();
        console.log(data.channels);
      } catch (error) {
        console.error("Error fetching port API list:", error);
      }
    };

    getPortApiList();
  }, []);

  const filteredList = useMemo(() => {
    return list.filter((channel) => {
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = searchType ? channel.type === searchType : true;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, searchType]);

  const groupByType = (channels: Channel[]) => {
    return channels.reduce<Record<ChannelType, Channel[]>>((acc, curr) => {
      if (!acc[curr.type]) acc[curr.type] = [];
      acc[curr.type].push(curr);
      return acc;
    }, {} as Record<ChannelType, Channel[]>);
  };

  const grouped = useMemo(() => groupByType(filteredList), [filteredList]);

  const getTV = async (channelId: string) => {
    try {
      const now = new Date();
      const startDateTime = now.toISOString().split("T")[0]; // Extract only the date part (yyyy-mm-dd)
  
      const endDate = new Date();
      endDate.setDate(now.getDate() + addDate + 1);
      endDate.setHours(23, 59, 59, 999);
      const endDateTime = endDate.toISOString().split("T")[0]; // Extract only the date part (yyyy-mm-dd)
  
      const response = await fetch(
        `https://port.hu/tvapi?channel_id[]=${channelId}&i_datetime_from=${startDateTime}&i_datetime_to=${endDateTime}`
      );
      const data = await response.json();
  
      if (!data) {
        console.error("No data found");
        return;
      }
  
      const programs = Object.values(data)
        .flatMap((item: any) =>
          item.channels.flatMap((channel: any) => channel.programs)
        )
        .filter((program: any) => {
          const start = new Date(program.start_datetime);
          const end = new Date(program.end_datetime);
          return start >= now || (start <= now && end >= now);
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.start_datetime).getTime() -
            new Date(b.start_datetime).getTime()
        );
  
      setPrograms(programs);
      console.log(programs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
    if (choosenChannel) {
      getTV(choosenChannel);
    }
  }, [addDate]);

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
          className={`mr-2 px-3 py-1 rounded ${
            viewType === "type" ? "font-bold bg-gray-200" : ""
          }`}
          onClick={() => setViewType("type")}
        >
          Típus szerint
        </button>
        <button
          className={`px-3 py-1 rounded ${
            viewType === "all" ? "font-bold bg-gray-200" : ""
          }`}
          onClick={() => setViewType("all")}
        >
          Összes csatorna
        </button>
      </div>

      {viewType === "type" ? (
        Object.entries(grouped).map(([type, channels]: any) => (
          <div key={type} className="mb-6">
            <h2 className="text-xl font-bold mb-2">{type}</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {channels
                .sort((a: any, b: any) => a.channel - b.channel)
                .map(({ channel, name, id }: any) => (
                  <li
                    onClick={() => {
                      getTV(id);
                      setIsOpen(true);
                      setChoosenChannel(id);
                    }}
                    key={channel}
                    className="border p-2 rounded shadow-sm flex flex-row items-center justify-between cursor-pointer"
                  >
                    <p>
                      <strong>{channel}</strong> – {name}
                    </p>
                    {id && <NewspaperIcon className="text-gray-500" />}
                  </li>
                ))}
            </ul>
          </div>
        ))
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredList
            .sort((a, b) => a.channel - b.channel)
            .map(({ channel, name, type, id }: any) => (
              <li
                onClick={() => {
                  getTV(id);
                  setIsOpen(true);
                  setChoosenChannel(id);
                }}
                key={channel}
                className="border p-2 rounded shadow-sm flex flex-row items-center justify-between cursor-pointer"
              >
                <p>
                  <strong>{channel}</strong> – {name} ({type})
                </p>
                {id && <NewspaperIcon className="text-gray-500" />}
              </li>
            ))}
        </ul>
      )}

      <Modal state={isOpen} handlerFunction={() => setIsOpen(false)}>
        <div className="rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Műsorok</h2>
          <div className="max-h-[60vh] overflow-y-auto">
            {programs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nincs elérhető műsor információ.
              </p>
            ) : (
              <ul className="space-y-3 min-w-[70vw]">
                {programs.map((program, index) => (
                  <li
                    key={index}
                    className="bg-white w-full py-2 rounded-lg transition-shadow"
                  >
                    <div className="flex w-full justify-between items-center">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <strong>{program.title}</strong>
                        </h3>
                        <h3 className="text-sm font-normal text-gray-700">
                          {program.episode_title}
                        </h3>
                        <div className="flex flex-row items-center justify-between w-full">
                          <div>
                            <p>
                              <span className="font-medium">Dátum:</span>{" "}
                              {(() => {
                                const today = new Date();
                                const programDate = new Date(program.start_datetime);
                                const todayDateOnly: any = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                const programDateOnly: any = new Date(programDate.getFullYear(), programDate.getMonth(), programDate.getDate());
                                const diffInDays = Math.floor((programDateOnly - todayDateOnly) / (1000 * 60 * 60 * 24));

                                if (diffInDays === 0) return "Ma";
                                if (diffInDays === 1) return "Holnap";
                                if (diffInDays === 2) return "Holnap után";

                                return programDate.toLocaleDateString("hu-HU", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }).replace(/\./g, ".");
                              })()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Idő:</span>{" "}
                              {formatDateTime(program.start_datetime, "time")} -{" "}
                              {formatDateTime(program.end_datetime, "time")}
                            </p>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(program.start_datetime) <= new Date() &&
                            new Date(program.end_datetime) >= new Date() ? (
                              <span className="inline-block text-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                Jelenleg megy
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Következik
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="mt-8 border-gray-300" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <select
              id="addDate"
              value={addDate}
              onChange={(e) => setAddDate(Number(e.target.value))}
              className="border-none p-2 rounded w-24"
            >
              {[...Array(21).keys()].map((i) => (
                <option key={i} value={i}>
                  {i === 0 ? "Csak ma" : `${i + 1} nap`}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Bezárás
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TVList;
