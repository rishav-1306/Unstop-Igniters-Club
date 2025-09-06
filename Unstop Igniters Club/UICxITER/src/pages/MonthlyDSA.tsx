import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Calendar as CalendarIcon, Code, Trophy, Clock, ExternalLink, Target } from "lucide-react";

const MonthlyDSA = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleTakeDSAQuiz = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login first to take the DSA quiz",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: "DSA Challenge Starting",
      description: "The DSA challenge interface will be available here",
    });
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getNextMonth = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Mock data for demonstration
  const currentChallenge = {
    month: getCurrentMonth(),
    theme: "Graph Algorithms & Trees",
    totalProblems: 25,
    difficulty: "Mixed",
    timeLeft: "12 days",
    participants: 450,
  };

  const upcomingChallenge = {
    month: getNextMonth(),
    theme: "Dynamic Programming Mastery",
    totalProblems: 30,
    difficulty: "Advanced",
    startDate: "1st of next month",
  };

  const dsaTopics = [
    { name: "Arrays & Strings", problems: 8, completed: 6 },
    { name: "Linked Lists", problems: 5, completed: 3 },
    { name: "Trees & Graphs", problems: 7, completed: 2 },
    { name: "Dynamic Programming", problems: 5, completed: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Monthly DSA Challenge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master Data Structures & Algorithms with our comprehensive monthly challenges
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Calendar & Schedule */}
          <div>
            <Card className="card-glass mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  DSA Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-border"
                />
                <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                  <h4 className="font-semibold text-secondary mb-2">This Month</h4>
                  <p className="text-sm text-foreground">{currentChallenge.theme}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentChallenge.totalProblems} problems available
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-secondary" />
                  Progress Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dsaTopics.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-muted-foreground">
                          {topic.completed}/{topic.problems}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(topic.completed / topic.problems) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Month Challenge */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Current Challenge
              </h2>
              
              <Card className="card-glass border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {currentChallenge.theme}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        {currentChallenge.month}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {currentChallenge.totalProblems}
                          </div>
                          <div className="text-sm text-muted-foreground">Problems</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-secondary">
                            {currentChallenge.participants}
                          </div>
                          <div className="text-sm text-muted-foreground">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {currentChallenge.timeLeft}
                          </div>
                          <div className="text-sm text-muted-foreground">Time Left</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            Mixed
                          </div>
                          <div className="text-sm text-muted-foreground">Difficulty</div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      LIVE
                    </Badge>
                  </div>
                  <Button
                    onClick={handleTakeDSAQuiz}
                    className="btn-hero mr-4"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Start Challenge
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/leaderboard")}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View Leaderboard
                  </Button>
                </CardContent>
              </Card>

              {/* Current Challenge Content Placeholder */}
              <Card className="card-glass border-2 border-dashed border-border mt-4">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Current DSA Challenge Content Area
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This section is reserved for current month's DSA challenge content,
                    problem sets, and additional resources.
                  </p>
                  <div className="bg-muted/50 p-4 rounded border">
                    <p className="text-sm text-muted-foreground">
                      Add your current DSA challenge content here...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Challenge */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-8 h-8 text-secondary" />
                Upcoming Challenge
              </h2>
              
              <Card className="card-glass border-l-4 border-l-secondary">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {upcomingChallenge.theme}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        {upcomingChallenge.month}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-secondary">
                            {upcomingChallenge.totalProblems}
                          </div>
                          <div className="text-sm text-muted-foreground">Problems</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {upcomingChallenge.difficulty}
                          </div>
                          <div className="text-sm text-muted-foreground">Difficulty</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-secondary">
                            1st
                          </div>
                          <div className="text-sm text-muted-foreground">Start Date</div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">
                      UPCOMING
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Get Notified
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Challenge Content Placeholder */}
              <Card className="card-glass border-2 border-dashed border-border mt-4">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Upcoming DSA Challenge Content Area
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This section is reserved for upcoming month's DSA challenge preview,
                    preparation materials, and topic roadmap.
                  </p>
                  <div className="bg-muted/50 p-4 rounded border">
                    <p className="text-sm text-muted-foreground">
                      Add your upcoming DSA challenge content here...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDSA;