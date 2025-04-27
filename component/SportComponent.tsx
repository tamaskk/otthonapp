import React, { useEffect, useState } from "react";
import { list } from "@/db/TVList";
import { combinedTeamsSearchMap, pairedTeams } from "@/db/footballs";
import { leagueWithIds } from "@/db/football";

interface Match {
  date: string;
  round: string;
  score?: {
    ft: number[];
    ht: number[];
  };
  team1: string;
  team2: string;
  time: string;
  sport?: string;
  country?: string;
  channel?: string;
}

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

const SportComponent: React.FC = () => {
  const [choosenLeagues, setChoosenLeagues] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [sportChannels, setSportChannels] = useState<any[]>([]);
  const [tvPrograms, setTVPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelNames, setChannelNames] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);
  const [isLeagueChooserOpen, setIsLeagueChooserOpen] = useState(false); // New state for toggling
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Default to today in YYYY-MM-DD

// Load leagues from localStorage on component mount
useEffect(() => {
  const storedLeagues = localStorage.getItem("choosenLeagues");
  if (storedLeagues) {
    setChoosenLeagues(JSON.parse(storedLeagues));
  }
}, []);

// Sync choosenLeagues with localStorage whenever it changes
useEffect(() => {
  localStorage.setItem("choosenLeagues", JSON.stringify(choosenLeagues));
}, [choosenLeagues]);

  useEffect(() => {
    const getMatches = async () => {
      const url =
        `https://www.sofascore.com/api/v1/sport/football/scheduled-events/${selectedDate}`

      const idsOfLeagues = choosenLeagues.map((league) => league.id);

      try {
        const response = await fetch(url);
        const result = await response.json();

        // Separate matches into two groups
        const activeMatches = result.events
          .filter((match: any) => {
            const leagueId = match.tournament.uniqueTournament.id;
            return idsOfLeagues.includes(leagueId) && match.status.code !== 100;
          })
          .sort((a: any, b: any) => a.startTimestamp - b.startTimestamp);

        const finishedMatches = result.events
          .filter((match: any) => {
            const leagueId = match.tournament.uniqueTournament.id;
            return idsOfLeagues.includes(leagueId) && match.status.code === 100;
          })
          .sort((a: any, b: any) => a.startTimestamp - b.startTimestamp);

        // Concatenate active matches followed by finished matches
        const filteredMatches = [...activeMatches, ...finishedMatches];

        setMatches(filteredMatches);

        console.log("Filtered Matches:", filteredMatches);
        console.log("All Events:", result.events);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getMatches();
  }, [choosenLeagues, selectedDate]);

    // Handle date change (arrow buttons)
    const changeDate = (direction: "prev" | "next") => {
      const currentDate = new Date(selectedDate);
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
      setSelectedDate(newDate.toISOString().split("T")[0]);
    };
  
    // Handle direct date input
    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setSelectedDate(value);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Football Match Viewer
        </h1>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Select Leagues
            </h2>
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setIsLeagueChooserOpen(!isLeagueChooserOpen)}
            >
              {isLeagueChooserOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>
          </div>

          {isLeagueChooserOpen && (
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">
                  Choose your leagues
                </h3>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {leagueWithIds.map((league) => {
                  const isSelected = choosenLeagues.includes(league);
                  return (
                    <button
                      key={league.id}
                      className={`relative flex items-center px-4 py-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      } hover:bg-green-400 hover:text-white`}
                      onClick={() => {
                        if (isSelected) {
                          setChoosenLeagues(
                            choosenLeagues.filter((l) => l !== league)
                          );
                          localStorage.setItem(
                            "choosenLeagues",
                            JSON.stringify(
                              choosenLeagues.filter((l) => l !== league)
                            )
                          );
                        } else {
                          setChoosenLeagues([...choosenLeagues, league]);
                          localStorage.setItem(
                            "choosenLeagues",
                            JSON.stringify([...choosenLeagues, league])
                          );
                        }
                      }}
                    >
                      <span className="absolute top-1 left  left-1 text-sm">
                        {league.flag}
                      </span>
                      <span className="flex-1 text-center">{league.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-row items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-700 flex flex-row items-center justify-between flex-nowrap">
            Upcoming Matches
          </h2>
          <div className="flex items-center justify-center">
          <button
              onClick={() => changeDate("prev")}
              className="p-2 rounded-l-sm bg-gray-200 hover:bg-gray-300 focus:outline-none"
              aria-label="Previous day"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {/* <input
              type="date"
              value={selectedDate}
              onChange={handleDateInput}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            /> */}
            <span className="text-black bg-gray-200 py-[6px]">
              {new Date(selectedDate).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
            <button
              onClick={() => changeDate("next")}
              className="p-2 bg-gray-200 rounded-r-sm hover:bg-gray-300 focus:outline-none"
              aria-label="Next day"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          </div>
          {matches.length === 0 ? (
            <p className="text-gray-500">
              No matches found for selected leagues.
            </p>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2 text-black flex flex-col items-center justify-center gap-1">
                      {
                        leagueWithIds.find(
                          (league) =>
                            league.id === match.tournament.uniqueTournament.id
                        )?.flag
                      }
                      {
                        match.status.type === "inprogress" && (
                          <span className="text-white text-sm font-light p-1 rounded-lg bg-yellow-300">
                            ÉLŐ
                          </span>
                        )
                      }
                      {
                        match.status.code === 100 && (
                          <span className="text-white text-sm font-light p-1 rounded-lg bg-gray-400">
                            VÉGE
                          </span>
                        )
                      }
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {match?.homeTeam.name} vs {match.awayTeam.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.roundInfo.round}. forduló |{" "}
                        {new Date(
                          match.startTimestamp * 1000
                        ).toLocaleTimeString("en-UK", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        | {new Date(match.startTimestamp * 1000).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex gap-4">
                    {match.status.type === "inprogress" && (
                      <span className="text-sm font-bold text-green-500 flex-nowrap">
                        {match.homeScore.current} - {match.awayScore.current}
                      </span>
                    )}
                    <span className="text-lg">⚽</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SportComponent;