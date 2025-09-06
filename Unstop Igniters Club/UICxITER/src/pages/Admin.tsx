import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Settings, ExternalLink, Database, FileSpreadsheet, Calendar, Trophy } from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [googleFormLinks, setGoogleFormLinks] = useState({
    weeklyQuiz: "",
    monthlyDSA: "",
    hackathon: ""
  });
  const [sheetsConfig, setSheetsConfig] = useState({
    weeklyQuizSheetId: "",
    monthlyDSASheetId: "",
    hackathonSheetId: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsLoggedIn(loggedIn);
    setIsAdmin(adminStatus);
  }, []);

  const handleSaveFormLink = async (type: string, link: string) => {
    try {
      const response = await fetch('/api/admin/form-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type, link })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Form link saved successfully"
        });
      } else {
        throw new Error('Failed to save form link');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form link",
        variant: "destructive"
      });
    }
  };

  const handleSaveSheetsConfig = async (type: string, sheetId: string) => {
    try {
      const response = await fetch('/api/admin/sheets-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type, sheetId })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Google Sheets configuration saved successfully"
        });
      } else {
        throw new Error('Failed to save sheets configuration');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sheets configuration",
        variant: "destructive"
      });
    }
  };

  const syncLeaderboard = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/sync-leaderboard/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Leaderboard synced successfully"
        });
      } else {
        throw new Error('Failed to sync leaderboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync leaderboard",
        variant: "destructive"
      });
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground">
                You need admin privileges to access this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Admin Panel</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage quizzes, forms, and leaderboard synchronization
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="forms" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Form Links
              </TabsTrigger>
              <TabsTrigger value="sheets" className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Google Sheets
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Sync Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forms">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Weekly Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="weekly-form">Google Form Link</Label>
                      <Input
                        id="weekly-form"
                        placeholder="https://forms.google.com/..."
                        value={googleFormLinks.weeklyQuiz}
                        onChange={(e) => setGoogleFormLinks({
                          ...googleFormLinks,
                          weeklyQuiz: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveFormLink('weekly', googleFormLinks.weeklyQuiz)}
                      className="w-full"
                    >
                      Save Form Link
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-secondary" />
                      Monthly DSA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="dsa-form">Google Form Link</Label>
                      <Input
                        id="dsa-form"
                        placeholder="https://forms.google.com/..."
                        value={googleFormLinks.monthlyDSA}
                        onChange={(e) => setGoogleFormLinks({
                          ...googleFormLinks,
                          monthlyDSA: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveFormLink('monthly-dsa', googleFormLinks.monthlyDSA)}
                      className="w-full"
                    >
                      Save Form Link
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Hackathon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hackathon-form">Google Form Link</Label>
                      <Input
                        id="hackathon-form"
                        placeholder="https://forms.google.com/..."
                        value={googleFormLinks.hackathon}
                        onChange={(e) => setGoogleFormLinks({
                          ...googleFormLinks,
                          hackathon: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveFormLink('hackathon', googleFormLinks.hackathon)}
                      className="w-full"
                    >
                      Save Form Link
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sheets">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      Weekly Quiz Sheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="weekly-sheet">Google Sheet ID</Label>
                      <Input
                        id="weekly-sheet"
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        value={sheetsConfig.weeklyQuizSheetId}
                        onChange={(e) => setSheetsConfig({
                          ...sheetsConfig,
                          weeklyQuizSheetId: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveSheetsConfig('weekly', sheetsConfig.weeklyQuizSheetId)}
                      className="w-full"
                    >
                      Save Sheet Config
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-secondary" />
                      Monthly DSA Sheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="dsa-sheet">Google Sheet ID</Label>
                      <Input
                        id="dsa-sheet"
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        value={sheetsConfig.monthlyDSASheetId}
                        onChange={(e) => setSheetsConfig({
                          ...sheetsConfig,
                          monthlyDSASheetId: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveSheetsConfig('monthly-dsa', sheetsConfig.monthlyDSASheetId)}
                      className="w-full"
                    >
                      Save Sheet Config
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      Hackathon Sheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hackathon-sheet">Google Sheet ID</Label>
                      <Input
                        id="hackathon-sheet"
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        value={sheetsConfig.hackathonSheetId}
                        onChange={(e) => setSheetsConfig({
                          ...sheetsConfig,
                          hackathonSheetId: e.target.value
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSaveSheetsConfig('hackathon', sheetsConfig.hackathonSheetId)}
                      className="w-full"
                    >
                      Save Sheet Config
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-glass mt-6">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Setting up Google Sheets Integration:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Create a Google Form connected to a Google Sheet</li>
                        <li>Ensure the sheet has columns: Name, Email, Score</li>
                        <li>Copy the Sheet ID from the URL (between /d/ and /edit)</li>
                        <li>Make the sheet publicly readable or configure API access</li>
                        <li>Save the Sheet ID in the configuration above</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-primary" />
                      Weekly Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sync leaderboard data from Google Sheets
                    </p>
                    <Button 
                      onClick={() => syncLeaderboard('weekly')}
                      className="w-full"
                    >
                      Sync Weekly Quiz Data
                    </Button>
                    <Badge variant="outline" className="w-full justify-center">
                      Last sync: Never
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-secondary" />
                      Monthly DSA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sync leaderboard data from Google Sheets
                    </p>
                    <Button 
                      onClick={() => syncLeaderboard('monthly-dsa')}
                      className="w-full"
                    >
                      Sync DSA Data
                    </Button>
                    <Badge variant="outline" className="w-full justify-center">
                      Last sync: Never
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-primary" />
                      Hackathon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sync leaderboard data from Google Sheets
                    </p>
                    <Button 
                      onClick={() => syncLeaderboard('hackathon')}
                      className="w-full"
                    >
                      Sync Hackathon Data
                    </Button>
                    <Badge variant="outline" className="w-full justify-center">
                      Last sync: Never
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;