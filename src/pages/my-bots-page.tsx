
"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Eye,
  MessageSquare,
  Users,
  Activity,
  Zap,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MyBotsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [newBot, setNewBot] = useState({
    botToken: "",
    botName: "",
    botUsername: "",
    systemPrompt: "Aku adalah asisten AI Telegram Bot"
  });

  // Mock data for now - replace with actual API calls
  const bots: any[] = [];
  const isLoading = false;

  const handleCreateBot = async () => {
    if (!newBot.botToken || !newBot.botName) {
      toast({
        title: "Error",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: newBot.botToken,
          botName: newBot.botName,
          botUsername: newBot.botUsername,
          systemPrompt: newBot.systemPrompt
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewBot({
          botToken: "",
          botName: "",
          botUsername: "",
          systemPrompt: "Aku adalah asisten AI Telegram Bot"
        });
        toast({
          title: "Success",
          description: "Bot has been created successfully!",
        });
        // Refresh the page or update state
        window.location.reload();
      } else {
        throw new Error('Failed to create bot');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create bot.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBot = async (bot: any) => {
    try {
      const response = await fetch(`/api/bots/${bot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !bot.isActive }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Bot status updated successfully!",
        });
        // Refresh data
        window.location.reload();
      } else {
        throw new Error('Failed to update bot status');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bot status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBot = async (bot: any) => {
    if (confirm(`Are you sure you want to delete "${bot.botName}"?`)) {
      try {
        const response = await fetch(`/api/bots/${bot.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Bot deleted successfully!",
          });
          // Refresh data
          window.location.reload();
        } else {
          throw new Error('Failed to delete bot');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete bot.",
          variant: "destructive",
        });
      }
    }
  };

  const handleManageKnowledge = (bot: any) => {
    setSelectedBot(bot);
    setShowKnowledgeModal(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Bots</h1>
            <p className="text-muted-foreground">Manage your Telegram bots and their AI capabilities</p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Create New Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Bot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="botToken">Bot Token *</Label>
                  <Input
                    id="botToken"
                    placeholder="Your Telegram bot token"
                    value={newBot.botToken}
                    onChange={(e) => setNewBot({ ...newBot, botToken: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="botName">Bot Name *</Label>
                  <Input
                    id="botName"
                    placeholder="My Awesome Bot"
                    value={newBot.botName}
                    onChange={(e) => setNewBot({ ...newBot, botName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="botUsername">Bot Username</Label>
                  <Input
                    id="botUsername"
                    placeholder="@myawesomebot"
                    value={newBot.botUsername}
                    onChange={(e) => setNewBot({ ...newBot, botUsername: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="Define how your bot should behave..."
                    value={newBot.systemPrompt}
                    onChange={(e) => setNewBot({ ...newBot, systemPrompt: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleCreateBot} 
                  className="w-full"
                >
                  Create Bot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                  <p className="text-2xl font-bold text-foreground">{Array.isArray(bots) ? bots.length : 0}</p>
                </div>
                <Bot className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold text-green-500">
                    {Array.isArray(bots) ? bots.filter((bot: any) => bot.isActive).length : 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
                  <p className="text-2xl font-bold text-amber-500">{user?.credits || 0}</p>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bots Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-card border-border">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : Array.isArray(bots) && bots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot: any) => (
              <Card key={bot.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">{bot.botName}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{bot.botUsername}</p>
                      </div>
                    </div>
                    <Badge variant={bot.isActive ? "default" : "secondary"} className="text-foreground border-border">
                      {bot.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {bot.description || "No description available"}
                  </p>
                  
                  {/* Bot Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <MessageSquare className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Messages</p>
                      <p className="text-sm font-semibold text-foreground">{bot.messageCount || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Users</p>
                      <p className="text-sm font-semibold text-foreground">{bot.userCount || 0}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleManageKnowledge(bot)}
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Knowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBot(bot)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No bots yet</h3>
              <p className="text-slate-600 mb-6">Create your first Telegram bot to get started</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Bot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
