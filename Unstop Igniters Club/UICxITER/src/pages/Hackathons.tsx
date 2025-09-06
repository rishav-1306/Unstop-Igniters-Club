import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Calendar as CalendarIcon, Users, Trophy, Clock, ExternalLink } from "lucide-react";

const Hackathons = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleJoinHackathon = (hackathonId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login first to join hackathons",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Registration Opened",
      description: `You have successfully registered for hackathon ${hackathonId}`,
    });
  };

  // Mock data for demonstration
  const upcomingHackathons = [
    {
      id: "hack1",
      title: "AI Innovation Challenge",
      date: "2024-03-15",
      duration: "48 hours",
      participants: 250,
      prize: "₹1,00,000",
      status: "upcoming",
    },
    {
      id: "hack2",
      title: "Web3 Builder Fest",
      date: "2024-03-22",
      duration: "36 hours",
      participants: 180,
      prize: "₹75,000",
      status: "upcoming",
    },
  ];

  const liveHackathons = [
    {
      id: "hack3",
      title: "Fintech Revolution",
      date: "2024-02-28",
      duration: "72 hours",
      participants: 320,
      prize: "₹1,50,000",
      status: "live",
      timeLeft: "2 days 14 hours",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Join Hackathons</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participate in exciting hackathons, build innovative solutions, and win amazing prizes!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Calendar Section */}
          <div>
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  Hackathon Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-border"
                />
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Upcoming Events</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>AI Challenge</span>
                      <span className="text-muted-foreground">Mar 15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Web3 Fest</span>
                      <span className="text-muted-foreground">Mar 22</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hackathons Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Hackathons */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                Live Hackathons
              </h2>
              <div className="space-y-4">
                {liveHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="card-glass border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {hackathon.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {hackathon.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {hackathon.participants} participants
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {hackathon.prize}
                            </span>
                          </div>
                          <div className="text-red-500 font-semibold">
                            Time Left: {hackathon.timeLeft}
                          </div>
                        </div>
                        <Badge variant="destructive" className="bg-red-500">
                          LIVE
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleJoinHackathon(hackathon.id)}
                        className="btn-hero"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Placeholder for admin content */}
                <Card className="card-glass border-2 border-dashed border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      Live Hackathon Content Area
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section is reserved for you to add live hackathon details, 
                      rules, and additional information.
                    </p>
                    <div className="bg-muted/50 p-4 rounded border">
                      <p className="text-sm text-muted-foreground">
                        Add your live hackathon content here...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Hackathons */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-8 h-8 text-secondary" />
                Upcoming Hackathons
              </h2>
              <div className="space-y-4">
                {upcomingHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="card-glass border-l-4 border-l-secondary">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {hackathon.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(hackathon.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {hackathon.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {hackathon.participants} registered
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {hackathon.prize}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-secondary text-secondary-foreground">
                          UPCOMING
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleJoinHackathon(hackathon.id)}
                        className="btn-secondary"
                      >
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Placeholder for admin content */}
                <Card className="card-glass border-2 border-dashed border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      Upcoming Hackathon Content Area
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section is reserved for you to add upcoming hackathon details, 
                      themes, and registration information.
                    </p>
                    <div className="bg-muted/50 p-4 rounded border">
                      <p className="text-sm text-muted-foreground">
                        Add your upcoming hackathon content here...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;