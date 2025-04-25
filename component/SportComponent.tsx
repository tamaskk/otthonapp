import React, { useEffect, useState } from 'react';

const LeagueTypes = {
  BELGIUM1: 'be.1',
  GERMAN1: 'de.1',
  ENGLAND1: 'en.1',
  ENGLAND2: 'en.2',
  SPAIN1: 'es.1',
  FRANCE1: 'fr.1',
  ITALY1: 'it.1',
  NETHERLANDS1: 'nl.1',
  PORTUGAL1: 'pt.1',
  TURKEY1: 'tr.1',
  CHAMPIONSLEAGUE: 'uefa.cl',
} as const;

type LeagueType = typeof LeagueTypes[keyof typeof LeagueTypes];

interface Match {
  date: string;
  round: string;
  team1: string;
  team2: string;
  time: string;
  sport?: string;
  country?: string;
}

const leagueFlags: Record<LeagueType, string> = {
  'be.1': '🇧🇪',
  'de.1': '🇩🇪',
  'en.1': '🏴',
  'en.2': '🏴',
  'es.1': '🇪🇸',
  'fr.1': '🇫🇷',
  'it.1': '🇮🇹',
  'nl.1': '🇳🇱',
  'pt.1': '🇵🇹',
  'tr.1': '🇹🇷',
  'uefa.cl': '🏆',
};

const SportComponent: React.FC = () => {
  const [choosenLeagues, setChoosenLeagues] = useState<LeagueType[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leagueTypesInArray = Object.values(LeagueTypes);

  const getChoosenLeagues = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const seasonStartYear = month >= 7 ? year : year - 1;
      const seasonEndYear = seasonStartYear + 1;
      const seasonFormat = `${seasonStartYear}-${seasonEndYear.toString().slice(-2)}`;

      const filteredMatches: Match[] = [];

      for (const league of choosenLeagues) {
        const url = `https://raw.githubusercontent.com/openfootball/football.json/master/${seasonFormat}/${league}.json`;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${league} data`);
          const data = await response.json();

          const allMatches = data.matches || [];

          const upcomingOrTodayMatches = allMatches
            .filter((match: any) => match.date >= todayStr)
            .map((match: any): Match => ({
              date: match.date,
              round: match.round || 'Unknown Round',
              team1: match.team1 || 'TBD',
              team2: match.team2 || 'TBD',
              time: match.time || 'TBD',
              country: league,
              sport: 'Football',
            }));

          filteredMatches.push(...upcomingOrTodayMatches);
        } catch (err) {
          console.error(`Error fetching ${league}:`, err);
        }
      }

      const sortedMatches = filteredMatches.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });

      setMatches(sortedMatches);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (choosenLeagues.length > 0) {
      getChoosenLeagues();
    } else {
      setMatches([]);
    }
  }, [choosenLeagues]);

  const leagueName = (league: LeagueType) => {
    switch (league) {
      case LeagueTypes.BELGIUM1:
        return `Belgium Pro League ${leagueFlags[league]}`;
      case LeagueTypes.GERMAN1:
        return `Bundesliga ${leagueFlags[league]}`;
      case LeagueTypes.ENGLAND1:
        return `Premier League ${leagueFlags[league]}`;
      case LeagueTypes.ENGLAND2:
        return `Championship ${leagueFlags[league]}`;
      case LeagueTypes.SPAIN1:
        return `La Liga ${leagueFlags[league]}`;
      case LeagueTypes.FRANCE1:
        return `Ligue 1 ${leagueFlags[league]}`;
      case LeagueTypes.ITALY1:
        return `Serie A ${leagueFlags[league]}`;
      case LeagueTypes.NETHERLANDS1:
        return `Eredivisie ${leagueFlags[league]}`;
      case LeagueTypes.PORTUGAL1:
        return `Primeira Liga ${leagueFlags[league]}`;
      case LeagueTypes.TURKEY1:
        return `Süper Lig ${leagueFlags[league]}`;
      case LeagueTypes.CHAMPIONSLEAGUE:
        return `Champions League ${leagueFlags[league]}`;
      default:
        return league;
    }
  };

  const groupedMatches = matches.reduce<Record<string, Match[]>>((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sport</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Válassz ligát</h2>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {leagueTypesInArray.map((league) => {
              const isSelected = choosenLeagues.includes(league);
              return (
                <button
                  key={league}
                  className={`relative flex items-center px-4 py-3 rounded-lg transition-all ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                  } hover:bg-green-400 hover:text-white`}
                  onClick={() => {
                    setChoosenLeagues((prev) =>
                      prev.includes(league)
                        ? prev.filter((l) => l !== league)
                        : [...prev, league]
                    );
                  }}
                >
                  <span className="flex-1 text-center">
                    {leagueName(league)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Matches</h2>
          {matches.length === 0 ? (
            <p className="text-gray-500">No matches found for selected leagues.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMatches).map(([date, dayMatches]) => (
                <div key={date}>
                  <div className="border-t pt-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-600">
                      {new Date(date).toLocaleDateString('hu-HU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {dayMatches.map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {match.country && leagueFlags[match.country as LeagueType]}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800">
                              {match.team1} vs {match.team2}
                            </p>
                            <p className="text-sm text-gray-500">
                              {match.round} | {match.time}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg">⚽</span>
                      </div>
                    ))}
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
