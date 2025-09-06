import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { User, Trophy, Calendar, Star, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "",
    phone: "+91 9876543210",
    dob: "1995-06-15",
    joinedDate: "2024-01-15",
    totalQuizzes: 12,
    currentRank: 15,
    points: 2450,
    hackathonsJoined: 5,
  });
  const [editForm, setEditForm] = useState(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    
    setIsLoggedIn(true);
    setUserProfile(prev => ({ ...prev, email: email || prev.email }));
    setEditForm(prev => ({ ...prev, email: email || prev.email }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(userProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // TODO: Save to MongoDB
    setUserProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated!",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const stats = [
    {
      title: "Total Quizzes",
      value: userProfile.totalQuizzes,
      icon: <Trophy className="w-6 h-6 text-secondary" />,
      color: "secondary",
    },
    {
      title: "Current Rank",
      value: `#${userProfile.currentRank}`,
      icon: <Star className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      title: "Total Points",
      value: userProfile.points,
      icon: <Star className="w-6 h-6 text-secondary" />,
      color: "secondary",
    },
    {
      title: "Hackathons",
      value: userProfile.hackathonsJoined,
      icon: <Calendar className="w-6 h-6 text-primary" />,
      color: "primary",
    },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {userProfile.name}! Track your progress and manage your profile.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-2">
              <Card className="card-glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Profile Information
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="btn-hero"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditToggle}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditToggle}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={isEditing ? editForm.name : userProfile.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={isEditing ? editForm.email : userProfile.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={isEditing ? editForm.phone : userProfile.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={isEditing ? editForm.dob : userProfile.dob}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Member Since</Label>
                        <div className="mt-1 px-3 py-2 bg-muted rounded-md text-muted-foreground">
                          {new Date(userProfile.joinedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="text-center">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {stat.icon}
                          <span className="font-medium">{stat.title}</span>
                        </div>
                        <span className="text-lg font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="text-center">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigate("/weekly-quiz")}
                    className="w-full btn-hero"
                  >
                    Take Weekly Quiz
                  </Button>
                  <Button
                    onClick={() => navigate("/hackathons")}
                    className="w-full btn-secondary"
                  >
                    Join Hackathon
                  </Button>
                  <Button
                    onClick={() => navigate("/monthly-dsa")}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    DSA Challenge
                  </Button>
                  <Button
                    onClick={() => navigate("/leaderboard")}
                    variant="outline"
                    className="w-full"
                  >
                    View Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;