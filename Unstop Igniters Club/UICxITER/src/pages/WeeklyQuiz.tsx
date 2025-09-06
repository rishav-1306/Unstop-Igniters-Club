import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Calendar as CalendarIcon, Clock, Trophy, ExternalLink } from "lucide-react";

const WeeklyQuiz = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleTakeQuiz = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login first to take the weekly quiz",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // TODO: Navigate to quiz interface or external quiz link
    toast({
      title: "Quiz Starting Soon",
      description: "The weekly quiz interface will be available here",
    });
  };

  const getNextSaturday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek) % 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + (daysUntilSaturday || 7));
    return nextSaturday;
  };

  const nextQuizDate = getNextSaturday();

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Weekly Quiz</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your coding skills every Saturday at 8 PM. Compete with fellow igniters and climb the leaderboard!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Quiz Schedule Card */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                Quiz Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">Every Saturday</h3>
                  <p className="text-lg text-foreground mb-2">8:00 PM IST</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: 2 hours
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Next Quiz:</p>
                  <p className="text-lg font-semibold text-foreground">
                    {nextQuizDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiz Actions Card */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-secondary" />
                Take Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-secondary/10 rounded-lg border border-secondary/20">
                  <Trophy className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Ready to Challenge Yourself?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Join the weekly coding quiz and test your problem-solving skills
                  </p>
                  <Button
                    onClick={handleTakeQuiz}
                    className="btn-secondary w-full"
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Take Weekly Quiz
                  </Button>
                </div>

                {/* Quiz Link Placeholder */}
                <div className="p-6 border-2 border-dashed border-border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Quiz Platform Integration
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This section is reserved for external quiz platform integration. 
                    You can add your preferred quiz platform link here.
                  </p>
                  <div className="bg-muted/50 p-4 rounded border">
                    <code className="text-sm">
                      {`// Quiz platform integration placeholder
// Add your quiz platform URL here
const QUIZ_URL = "https://your-quiz-platform.com";`}
                    </code>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    View your quiz performance
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/leaderboard")}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">2 Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete duration to solve all problems
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">5-8 Problems</h4>
                  <p className="text-sm text-muted-foreground">
                    Mix of easy, medium, and hard difficulty levels
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Weekly</h4>
                  <p className="text-sm text-muted-foreground">
                    Every Saturday at 8 PM IST
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklyQuiz;