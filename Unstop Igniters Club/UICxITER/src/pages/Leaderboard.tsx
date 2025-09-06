import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Trophy, Medal, Star, Crown, Code, Calendar } from "lucide-react";

const Leaderboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const [weeklyQuizLeaders, setWeeklyQuizLeaders] = useState([]);
  const [dsaLeaders, setDsaLeaders] = useState([]);
  const [hackathonLeaders, setHackathonLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const [weeklyResponse, dsaResponse, hackathonResponse] = await Promise.all([
          fetch('/api/leaderboard/weekly'),
          fetch('/api/leaderboard/monthly-dsa'),
          fetch('/api/leaderboard/hackathon')
        ]);

        const weeklyData = await weeklyResponse.json();
        const dsaData = await dsaResponse.json();
        const hackathonData = await hackathonResponse.json();

        setWeeklyQuizLeaders(weeklyData.leaderboard || []);
        setDsaLeaders(dsaData.leaderboard || []);
        setHackathonLeaders(hackathonData.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        // Fallback to empty arrays if API fails
        setWeeklyQuizLeaders([]);
        setDsaLeaders([]);
        setHackathonLeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-secondary" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-secondary/20 to-secondary/30 border-secondary/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default:
        return "bg-card/50 border-border/40";
    }
  };

  const LeaderboardTable = ({ 
    leaders, 
    type 
  }: { 
    leaders: any[], 
    type: 'quiz' | 'dsa' | 'hackathon' 
  }) => (
    <div className="space-y-3">
      {leaders.map((leader) => (
        <Card 
          key={leader.rank} 
          className={`${getRankStyle(leader.rank)} ${leader.rank <= 3 ? 'glow-effect' : ''} transition-all duration-300 hover:scale-[1.02]`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(leader.rank)}
                  <span className="font-bold text-lg">#{leader.rank}</span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {leader.avatar}
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground">{leader.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {leader.points} pts
                    </span>
                    {type === 'quiz' && (
                      <span className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {leader.quizzes} quizzes
                      </span>
                    )}
                    {type === 'dsa' && (
                      <span className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {leader.problems} problems
                      </span>
                    )}
                    {type === 'hackathon' && (
                      <>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {leader.hackathons} events
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {leader.wins} wins
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {leader.rank <= 3 && (
                <Badge 
                  className={
                    leader.rank === 1 
                      ? "bg-secondary text-secondary-foreground" 
                      : leader.rank === 2 
                      ? "bg-gray-400 text-gray-900" 
                      : "bg-amber-600 text-amber-900"
                  }
                >
                  {leader.rank === 1 ? "Champion" : leader.rank === 2 ? "Runner-up" : "3rd Place"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See where you stand among the top performers in our community
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="weekly-quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="weekly-quiz" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Weekly Quiz
              </TabsTrigger>
              <TabsTrigger value="monthly-dsa" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Monthly DSA
              </TabsTrigger>
              <TabsTrigger value="hackathons" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Hackathons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly-quiz">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Code className="w-6 h-6 text-primary" />
                    Weekly Quiz Champions
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Top performers based on weekly quiz performance and consistency
                  </p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <LeaderboardTable leaders={weeklyQuizLeaders} type="quiz" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly-dsa">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-secondary" />
                    DSA Challenge Masters
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Top performers in monthly Data Structures & Algorithms challenges
                  </p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <LeaderboardTable leaders={dsaLeaders} type="dsa" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hackathons">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    Hackathon Legends
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Top teams and individuals based on hackathon participation and wins
                  </p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <LeaderboardTable leaders={hackathonLeaders} type="hackathon" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;