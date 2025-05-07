import React, { useEffect, useState } from "react";
import { leagueWithIds } from "@/db/football";

interface Match {
  id: number;
  startTimestamp: number;
  tournament: {
    uniqueTournament: {
      id: number;
      name: string;
      category: {
        country: {
          alpha2: string;
        };
      };
    };
  };
  homeTeam: {
    name: string;
    score: {
      current: number;
    };
    country: {
      alpha2: string;
    };
  };
  awayTeam: {
    name: string;
    score: {
      current: number;
    };
    country: {
      alpha2: string;
    };
  };
  status: {
    code: number;
    type: string;
    description?: string;
  };
  roundInfo?: {
    round: number;
  };
  homeScore: {
    current: number;
  };
  awayScore: {
    current: number;
  };
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
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeagueChooserOpen, setIsLeagueChooserOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showFinishedMatches, setShowFinishedMatches] = useState(false);

  // Fetch matches for the selected date
  useEffect(() => {
    const getMatches = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${selectedDate}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug: Log the response

        if (!result.events || !Array.isArray(result.events)) {
          setAllMatches([]);
          setFilteredMatches([]);
          setError("No matches found for the selected date.");
          return;
        }

        // Sort matches by timestamp
        const sortedMatches = result.events.sort(
          (a: Match, b: Match) => a.startTimestamp - b.startTimestamp
        );

        setAllMatches(sortedMatches);
        setFilteredMatches(sortedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch matches"
        );
        setAllMatches([]);
        setFilteredMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    getMatches();
  }, [selectedDate]);

  // Filter matches when league is selected
  useEffect(() => {
    if (selectedLeague === null) {
      setFilteredMatches(allMatches);
    } else {
      const filtered = allMatches.filter(
        (match) => match.tournament.uniqueTournament.id === selectedLeague
      );
      setFilteredMatches(filtered);
    }
  }, [selectedLeague, allMatches]);

  // Handle date change
  const changeDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  // Separate and sort matches
  const activeMatches = filteredMatches
    .filter(
      (match) =>
        (match.homeScore.current === null ||
          match.homeScore.current === undefined) &&
        match.status.code !== 100
    )
    .sort((a, b) => a.startTimestamp - b.startTimestamp);

  const inProgressMatches = filteredMatches
    .filter(
      (match) =>
        match.homeScore.current !== null &&
        match.homeScore.current !== undefined &&
        match.status.code !== 100
    )
    .sort((a, b) => {
      const getMinute = (desc: string | undefined) => {
        if (!desc) return 0;
        const match = desc.match(/(\d+)'/);
        return match ? parseInt(match[1]) : 0;
      };
      const aMinute = getMinute(a.status.description);
      const bMinute = getMinute(b.status.description);
      return bMinute - aMinute; // Show most recent minutes first
    });

  const finishedMatches = filteredMatches
    .filter((match) => match.status.code === 100)
    .sort((a, b) => b.startTimestamp - a.startTimestamp);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Football Match Viewer
        </h1>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold text-gray-700">Select League</h2>
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
                  Choose a league
                </h3>
                <button
                  onClick={() => setSelectedLeague(null)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Show All
                </button>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {leagueWithIds.map((league) => (
                  <button
                    key={league.id}
                    className={`relative flex items-center px-4 py-3 rounded-lg transition-all ${
                      selectedLeague === league.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    } hover:bg-green-400 hover:text-white`}
                    onClick={() => setSelectedLeague(league.id)}
                  >
                    <span className="absolute top-1 left-1 text-sm">
                      {league.flag}
                    </span>
                    <span className="flex-1 text-center">{league.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-row items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-700">
              {selectedLeague
                ? `${
                    leagueWithIds.find((l) => l.id === selectedLeague)?.name
                  } Matches`
                : "All Matches"}
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
              <span className="text-black bg-gray-200 py-[6px] px-4">
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

          {isLoading ? (
            <p className="text-gray-500 text-center">Loading matches...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : filteredMatches.length === 0 ? (
            <p className="text-gray-500 text-center">
              No matches found for this date.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Live Matches */}
              {inProgressMatches.map((match) => (
                <div
                  key={match.id}
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
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-white text-sm font-light p-1 rounded-lg bg-yellow-300">
                          ÉLŐ
                        </span>
                        {match.tournament.uniqueTournament.category.country
                          .alpha2 ? (
                          <img
                            src={`https://flagsapi.com/${match.tournament.uniqueTournament.category.country.alpha2.toUpperCase()}/flat/32.png`}
                            alt="Country flag"
                          />
                        ) : (
                          <span className="text-gray-500 text-3xl">🇪🇺</span>
                        )}
                      </div>
                    </span>
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.roundInfo?.round}. forduló |{" "}
                        {new Date(
                          match.startTimestamp * 1000
                        ).toLocaleTimeString("en-UK", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex gap-4">
                    <span className="text-sm font-bold text-green-500 flex-nowrap">
                      {match.homeScore.current} - {match.awayScore.current}
                    </span>
                    <span className="text-lg">⚽</span>
                  </div>
                </div>
              ))}

              {/* Not Started Matches */}
              {activeMatches.map((match) => (
                <div
                  key={match.id}
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
                      {match.status.code === 0 && (
                        <div>
                          {match.tournament.uniqueTournament.category.country
                            .alpha2 ? (
                            <img
                              src={`https://flagsapi.com/${match.tournament.uniqueTournament.category.country.alpha2.toUpperCase()}/flat/32.png`}
                              alt="Country flag"
                            />
                          ) : (
                            <span className="text-gray-500 text-4xl">🇪🇺</span>
                          )}
                        </div>
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.roundInfo?.round}. forduló |{" "}
                        {new Date(
                          match.startTimestamp * 1000
                        ).toLocaleTimeString("en-UK", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex gap-4">
                    <span className="text-lg">⚽</span>
                  </div>
                </div>
              ))}

              {/* Finished Matches Dropdown */}
              {finishedMatches.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowFinishedMatches(!showFinishedMatches)}
                    className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium text-gray-700">
                      Finished Matches ({finishedMatches.length})
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        showFinishedMatches ? "rotate-180" : ""
                      }`}
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
                  </button>

                  {showFinishedMatches && (
                    <div className="mt-2 space-y-2">
                      {finishedMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-2 text-black flex flex-col items-center justify-center gap-1">
                              {
                                leagueWithIds.find(
                                  (league) =>
                                    league.id ===
                                    match.tournament.uniqueTournament.id
                                )?.flag
                              }
                              <div>
                                <span className="text-white text-sm font-light p-1 rounded-lg bg-gray-400">
                                  VÉGE
                                </span>
                                <img
                                  src={`https://flagsapi.com/${match.homeTeam.country.alpha2.toUpperCase()}/flat/32.png`}
                                  alt="Country flag"
                                />
                              </div>
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {match.roundInfo?.round}. forduló |{" "}
                                {new Date(
                                  match.startTimestamp * 1000
                                ).toLocaleTimeString("en-UK", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex gap-4">
                            <span className="text-sm font-bold text-gray-500 flex-nowrap">
                              {match.homeScore.current} - {match.awayScore.current}
                            </span>
                            <span className="text-lg">⚽</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SportComponent;