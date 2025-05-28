
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Bot, Keyboard, Settings, Play, Square, Edit3, Layers, Layers2, Menu, Grid3X3, Wand2, ChevronDown, ChevronRight, ToggleLeft, ToggleRight, Info, ArrowLeft, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AutoBot {
  id: number;
  token: string;
  botName: string;
  botUsername: string;
  welcomeMessage: string;
  welcomeImageUrl?: string;
  isActive: boolean;
  keyboardConfig: InlineKeyboard[];
  createdAt: string;
}

interface InlineKeyboard {
  id: string;
  text: string;
  callbackData: string;
  url?: string;
  parentId?: string; // untuk sub-menu
  level?: number; // 0 = menu utama, 1 = sub-menu
  responseText?: string; // teks respons yang dikirim ketika tombol diklik
  responseImage?: string; // URL gambar yang dikirim ketika tombol diklik
  isAllShow?: boolean; // untuk tombol All Show
}

export default function AutoBotBuilderPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [newBotToken, setNewBotToken] = useState("");
  const [botName, setBotName] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("Selamat datang! Silakan pilih opsi di bawah ini:");
  const [welcomeImageUrl, setWelcomeImageUrl] = useState("");
  const [keyboardButtons, setKeyboardButtons] = useState<InlineKeyboard[]>([]);
  const [editingBot, setEditingBot] = useState<AutoBot | null>(null);

  // Reset state when component mounts
  useEffect(() => {
    setNewBotToken("");
    setBotName("");
    setBotUsername("");
    setWelcomeMessage("Selamat datang! Silakan pilih opsi di bawah ini:");
    setKeyboardButtons([]);
    setEditingBot(null);
    setActiveTab("create");
  }, []);

  // Reset state when switching to create tab
  useEffect(() => {
    if (activeTab === "create") {
      setNewBotToken("");
      setBotName("");
      setBotUsername("");
      setWelcomeMessage("Selamat datang! Silakan pilih opsi di bawah ini:");
      setKeyboardButtons([]);
      setEditingBot(null);
    }
  }, [activeTab]);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [showSubMenuSelector, setShowSubMenuSelector] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newMainMenuText, setNewMainMenuText] = useState("");
  const [newMainMenuCallback, setNewMainMenuCallback] = useState("");
  const [newMainMenuUrl, setNewMainMenuUrl] = useState("");
  const [newMainMenuResponse, setNewMainMenuResponse] = useState("");
  const [isAllShowButton, setIsAllShowButton] = useState(false);
  const [newSubMenuText, setNewSubMenuText] = useState("");
  const [newSubMenuCallback, setNewSubMenuCallback] = useState("");
  const [newSubMenuUrl, setNewSubMenuUrl] = useState("");
  const [newSubMenuResponse, setNewSubMenuResponse] = useState("");
  const [selectedParentForNewSub, setSelectedParentForNewSub] = useState<string>("");
  const [newSubSubMenuText, setNewSubSubMenuText] = useState("");
  const [newSubSubMenuCallback, setNewSubSubMenuCallback] = useState("");
  const [newSubSubMenuUrl, setNewSubSubMenuUrl] = useState("");
  const [newSubSubMenuResponse, setNewSubSubMenuResponse] = useState("");
  const [selectedParentForNewSubSub, setSelectedParentForNewSubSub] = useState<string>("");
  const [showSubSubMenuSelector, setShowSubSubMenuSelector] = useState(false);
  const [selectedSubMenuForSubSub, setSelectedSubMenuForSubSub] = useState<string>("");
  const [showLevel4Selector, setShowLevel4Selector] = useState(false);
  const [selectedLevel3ForLevel4, setSelectedLevel3ForLevel4] = useState<string>("");
  const [showLevel5Selector, setShowLevel5Selector] = useState(false);
  const [selectedLevel4ForLevel5, setSelectedLevel4ForLevel5] = useState<string>("");
  
  // State for collapsed menu groups
  const [collapsedMenus, setCollapsedMenus] = useState<Set<string>>(new Set());

  // Helper function to toggle collapsed state
  const toggleMenuCollapse = (menuId: string) => {
    const newCollapsed = new Set(collapsedMenus);
    if (newCollapsed.has(menuId)) {
      newCollapsed.delete(menuId);
    } else {
      newCollapsed.add(menuId);
    }
    setCollapsedMenus(newCollapsed);
  };

  // Helper function to get all children of a menu recursively
  const getMenuChildren = (parentId: string, level: number = 1): InlineKeyboard[] => {
    const directChildren = keyboardButtons.filter(btn => btn.parentId === parentId && (btn.level || 0) === level);
    let allChildren: InlineKeyboard[] = [...directChildren];
    
    directChildren.forEach(child => {
      allChildren = [...allChildren, ...getMenuChildren(child.id, level + 1)];
    });
    
    return allChildren;
  };

  // Helper function to get level color and name
  const getLevelInfo = (level: number) => {
    const levelConfig = {
      0: { name: "Menu Utama", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Menu },
      1: { name: "Sub Menu", color: "bg-green-100 text-green-800 border-green-200", icon: Layers },
      2: { name: "Sub Level 1", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Layers2 },
      3: { name: "Sub Level 2", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Grid3X3 },
      4: { name: "Sub Level 3", color: "bg-red-100 text-red-800 border-red-200", icon: Settings }
    };
    return levelConfig[level as keyof typeof levelConfig] || levelConfig[0];
  };

  // Fetch auto bots with simple fetch
  const { data: autoBots = [], isLoading } = useQuery<AutoBot[]>({
    queryKey: ["/api/autobots"],
    queryFn: async () => {
      const response = await fetch("/api/autobots");
      if (!response.ok) throw new Error("Failed to fetch autobots");
      return response.json();
    }
  });

  // Create bot mutation
  const createBotMutation = useMutation({
    mutationFn: async (botData: any) => {
      const response = await fetch("/api/autobots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      resetForm();
      toast({
        title: "Bot Berhasil Dibuat!",
        description: "Bot Telegram Anda telah dibuat dan siap digunakan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update bot mutation
  const updateBotMutation = useMutation({
    mutationFn: async ({ id, ...botData }: any) => {
      const response = await fetch(`/api/autobots/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      resetForm();
      toast({
        title: "Bot Berhasil Diperbarui!",
        description: "Perubahan bot Telegram Anda telah disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle bot status mutation
  const toggleBotMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/autobots/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Bot Diperbarui",
        description: "Status bot berhasil diubah.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Mengubah Status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete bot mutation
  const deleteBotMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/autobots/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bot Berhasil Dihapus",
        description: "Bot telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateToken = async () => {
    if (!newBotToken.trim()) {
      toast({
        title: "Token Diperlukan",
        description: "Silakan masukkan token bot Telegram terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingToken(true);
    try {
      const response = await fetch("/api/autobots/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: newBotToken }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Gagal memvalidasi token");
      }

      if (result.valid && result.botInfo) {
        setBotName(result.botInfo.first_name);
        setBotUsername(result.botInfo.username);
        toast({
          title: "Token Valid!",
          description: `Bot "${result.botInfo.first_name}" (@${result.botInfo.username}) berhasil diverifikasi.`,
        });
      } else {
        throw new Error(result.error || "Token tidak valid");
      }
    } catch (error: any) {
      toast({
        title: "Token Tidak Valid",
        description: error.message || "Silakan periksa kembali token bot Anda.",
        variant: "destructive",
      });
      setBotName("");
      setBotUsername("");
    } finally {
      setIsValidatingToken(false);
    }
  };

  const addKeyboardButton = (level: number = 0, parentId?: string) => {
    const newButton: InlineKeyboard = {
      id: Date.now().toString(),
      text: "",
      callbackData: "",
      level: level,
      parentId: parentId
    };
    setKeyboardButtons([...keyboardButtons, newButton]);
  };

  const updateKeyboardButton = (id: string, field: keyof InlineKeyboard, value: string) => {
    setKeyboardButtons(buttons =>
      buttons.map(button =>
        button.id === id ? { ...button, [field]: value } : button
      )
    );
  };

  const removeKeyboardButton = (id: string) => {
    setKeyboardButtons(buttons => buttons.filter(button => button.id !== id));
  };

  const resetForm = () => {
    setNewBotToken("");
    setBotName("");
    setBotUsername("");
    setWelcomeMessage("Selamat datang! Silakan pilih opsi di bawah ini:");
    setKeyboardButtons([]);
    setEditingBot(null);
  };

  const startEditing = (bot: AutoBot) => {
    console.log('🔧 Starting to edit bot:', bot);
    setEditingBot(bot);
    setWelcomeMessage(bot.welcomeMessage);
    setWelcomeImageUrl(bot.welcomeImageUrl || "");
    setKeyboardButtons(bot.keyboardConfig || []);
  };

  const handleSubmit = async () => {
    if (editingBot) {
      updateBotMutation.mutate({
        id: editingBot.id,
        welcomeMessage,
        welcomeImageUrl,
        keyboardConfig: keyboardButtons,
      });
    } else {
      if (!newBotToken || !botName || !botUsername) {
        toast({
          title: "Data Tidak Lengkap",
          description: "Silakan validasi token bot terlebih dahulu.",
          variant: "destructive",
        });
        return;
      }

      createBotMutation.mutate({
        token: newBotToken,
        botName,
        botUsername,
        welcomeMessage,
        welcomeImageUrl,
        keyboardConfig: keyboardButtons,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Auto Bot Builder</h1>
        <p className="text-muted-foreground">Buat bot Telegram otomatis dengan keyboard inline bertingkat</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            Buat Bot
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Settings className="w-4 h-4 mr-2" />
            Kelola Bot
          </TabsTrigger>
          <TabsTrigger value="keyboard">
            <Keyboard className="w-4 h-4 mr-2" />
            Management Keyboard Inline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Bot className="w-5 h-5 mr-2 inline" />
                Konfigurasi Bot Baru
              </CardTitle>
              <CardDescription>
                Masukkan token bot Telegram dan konfigurasikan keyboard inline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editingBot && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="botToken">Token Bot Telegram</Label>
                    <div className="flex gap-2">
                      <Input
                        id="botToken"
                        placeholder="Masukkan token bot (contoh: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)"
                        value={newBotToken}
                        onChange={(e) => setNewBotToken(e.target.value)}
                        disabled={isValidatingToken}
                      />
                      <Button
                        onClick={validateToken}
                        disabled={isValidatingToken || !newBotToken.trim()}
                        variant="outline"
                      >
                        {isValidatingToken ? "Validasi..." : "Validasi"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan token dari @BotFather di Telegram
                    </p>
                  </div>

                  {botName && botUsername && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Bot Information:</p>
                      <p className="text-sm text-green-700">Name: {botName}</p>
                      <p className="text-sm text-green-700">Username: @{botUsername}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Pesan Sambutan</Label>
                <Textarea
                  id="welcomeMessage"
                  placeholder="Pesan yang akan ditampilkan saat pengguna mengetik /start"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeImageUrl">URL Gambar Sambutan (Opsional)</Label>
                <Input
                  id="welcomeImageUrl"
                  type="url"
                  placeholder="https://example.com/gambar.jpg"
                  value={welcomeImageUrl}
                  onChange={(e) => setWelcomeImageUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Gambar akan ditampilkan bersama pesan sambutan. Pastikan URL dapat diakses secara publik.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Keyboard Buttons</Label>
                  <Button onClick={() => addKeyboardButton(0)} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Button
                  </Button>
                </div>

                {keyboardButtons.map((button, index) => (
                  <Card key={button.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Button {index + 1}</h4>
                      <Button 
                        onClick={() => removeKeyboardButton(button.id)} 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Text</Label>
                        <Input
                          value={button.text}
                          onChange={(e) => updateKeyboardButton(button.id, "text", e.target.value)}
                          placeholder="Button text"
                        />
                      </div>
                      <div>
                        <Label>Callback Data</Label>
                        <Input
                          value={button.callbackData}
                          onChange={(e) => updateKeyboardButton(button.id, "callbackData", e.target.value)}
                          placeholder="callback_data"
                        />
                      </div>
                      <div>
                        <Label>URL (Optional)</Label>
                        <Input
                          value={button.url || ""}
                          onChange={(e) => updateKeyboardButton(button.id, "url", e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label>Response Text</Label>
                        <Input
                          value={button.responseText || ""}
                          onChange={(e) => updateKeyboardButton(button.id, "responseText", e.target.value)}
                          placeholder="Response message"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={createBotMutation.isPending || updateBotMutation.isPending}
                  className="flex-1"
                >
                  {editingBot ? "Perbarui Bot" : "Buat Bot"}
                </Button>
                
                {editingBot && (
                  <Button variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : autoBots.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada bot yang dibuat</p>
              </CardContent>
            </Card>
          ) : (
            autoBots.map((bot: AutoBot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        {bot.botName}
                        <Badge variant={bot.isActive ? "default" : "secondary"}>
                          {bot.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>@{bot.botUsername}</CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBotMutation.mutate({ id: bot.id, isActive: !bot.isActive })}
                        disabled={toggleBotMutation.isPending}
                        title={bot.isActive ? "Matikan Bot" : "Aktifkan Bot"}
                      >
                        {bot.isActive ? 
                          <ToggleRight className="w-5 h-5 text-green-600" /> : 
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        }
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(bot)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Bot</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus bot {bot.botName}? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBotMutation.mutate(bot.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Pesan Sambutan:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{bot.welcomeMessage}</p>
                    </div>
                    
                    {bot.keyboardConfig && bot.keyboardConfig.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Keyboard Configuration:</Label>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {bot.keyboardConfig.map((btn, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {btn.text || 'Untitled'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="keyboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Pilih Bot untuk Management Keyboard
              </CardTitle>
              <CardDescription>
                Pilih bot yang ingin Anda kelola keyboard inline-nya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">Loading bots...</div>
                ) : autoBots.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Belum ada bot yang dibuat. Silakan buat bot terlebih dahulu di tab "Buat Bot".
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {autoBots.map((bot: AutoBot) => (
                      <div 
                        key={bot.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          editingBot?.id === bot.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => startEditing(bot)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <Bot className="w-4 h-4" />
                              {bot.botName}
                              <Badge variant={bot.isActive ? "default" : "secondary"}>
                                {bot.isActive ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">@{bot.botUsername}</p>
                          </div>
                          {editingBot?.id === bot.id && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Dipilih
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {editingBot && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Keyboard Management - {editingBot.botName}
                </CardTitle>
                <CardDescription>
                  Kelola konfigurasi keyboard inline untuk @{editingBot.botUsername}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="welcomeMessageKeyboard">Pesan Sambutan</Label>
                    <Textarea
                      id="welcomeMessageKeyboard"
                      placeholder="Pesan sambutan bot"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="welcomeImageUrlKeyboard">URL Gambar Sambutan (Opsional)</Label>
                    <Input
                      id="welcomeImageUrlKeyboard"
                      type="url"
                      placeholder="https://example.com/gambar.jpg"
                      value={welcomeImageUrl}
                      onChange={(e) => setWelcomeImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Keyboard Buttons</Label>
                    <Button onClick={() => addKeyboardButton(0)} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Button
                    </Button>
                  </div>

                  {keyboardButtons.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Keyboard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Belum ada tombol keyboard</p>
                      <p className="text-sm text-gray-400">Klik "Add Button" untuk menambah tombol</p>
                    </div>
                  ) : (
                    keyboardButtons.map((button, index) => (
                      <Card key={button.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Button {index + 1}</h4>
                          <Button 
                            onClick={() => removeKeyboardButton(button.id)} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Text</Label>
                            <Input
                              value={button.text}
                              onChange={(e) => updateKeyboardButton(button.id, "text", e.target.value)}
                              placeholder="Button text"
                            />
                          </div>
                          <div>
                            <Label>Callback Data</Label>
                            <Input
                              value={button.callbackData}
                              onChange={(e) => updateKeyboardButton(button.id, "callbackData", e.target.value)}
                              placeholder="callback_data"
                            />
                          </div>
                          <div>
                            <Label>URL (Optional)</Label>
                            <Input
                              value={button.url || ""}
                              onChange={(e) => updateKeyboardButton(button.id, "url", e.target.value)}
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <Label>Response Text</Label>
                            <Input
                              value={button.responseText || ""}
                              onChange={(e) => updateKeyboardButton(button.id, "responseText", e.target.value)}
                              placeholder="Response message"
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={() => setEditingBot(null)} variant="outline">
                    Kembali
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={updateBotMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {updateBotMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
