import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Trophy, Code, Calendar, Users, Star, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Weekly Coding Quiz",
      description: "Challenge yourself every Saturday at 8 PM with exciting coding problems",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Hackathon Management",
      description: "Join live and upcoming hackathons, compete with the best minds",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Monthly DSA Challenge",
      description: "Master Data Structures & Algorithms with monthly challenges",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Leaderboard",
      description: "Track your progress and compete with fellow igniters",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Coders" },
    { number: "50+", label: "Hackathons Hosted" },
    { number: "1000+", label: "Problems Solved" },
    { number: "100+", label: "Winners" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary glow-effect">
                <Zap className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">Unstop</span>
              <br />
              <span className="text-foreground">Igniters Club</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join the ultimate hackathon community. Code, compete, and conquer with weekly quizzes, 
              monthly DSA challenges, and exciting hackathons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="btn-hero text-lg px-8 py-4"
              >
                <Star className="w-5 h-5 mr-2" />
                Join the Club
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/weekly-quiz")}
                className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Take Weekly Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">Igniters Club?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in competitive programming and hackathons
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-glass p-8 hover:glow-effect transition-all duration-300">
                <CardContent className="p-0">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient">Ignite</span> Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of passionate coders and start your competitive programming journey today
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="btn-hero text-lg px-12 py-4"
          >
            Start Coding Now
          </Button>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/assets/unstop-igniters-logo.png" 
            alt="UnstopXIter" 
            className="h-8 w-auto mx-auto mb-4"
          />
          <p className="text-muted-foreground">
            Empowering every coder to excel and innovate
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;