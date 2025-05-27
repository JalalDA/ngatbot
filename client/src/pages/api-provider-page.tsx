import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Copy, Eye, EyeOff, Plus, Key, DollarSign, Activity, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ApiKey {
  id: number;
  keyName: string;
  apiKey: string;
  isActive: boolean;
  lastUsed: string | null;
  totalRequests: number;
  totalOrders: number;
  totalRevenue: string;
  createdAt: string;
}

export default function ApiProviderPage() {
  const [showApiKey, setShowApiKey] = useState<{ [key: number]: boolean }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["/api/api-keys"],
  });

  // Create API key mutation
  const createApiKeyMutation = useMutation({
    mutationFn: (keyName: string) =>
      apiRequest("/api/api-keys", {
        method: "POST",
        body: { keyName },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setIsCreateModalOpen(false);
      setNewKeyName("");
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle API key status
  const toggleApiKeyMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest(`/api/api-keys/${id}/toggle`, {
        method: "PATCH",
        body: { isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      toast({
        title: "API Key Updated",
        description: "API key status has been updated successfully.",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }
    createApiKeyMutation.mutate(newKeyName);
  };

  // Calculate total statistics
  const totalStats = apiKeys?.reduce(
    (acc, key) => ({
      totalRequests: acc.totalRequests + key.totalRequests,
      totalOrders: acc.totalOrders + key.totalOrders,
      totalRevenue: acc.totalRevenue + parseFloat(key.totalRevenue),
    }),
    { totalRequests: 0, totalOrders: 0, totalRevenue: 0 }
  ) || { totalRequests: 0, totalOrders: 0, totalRevenue: 0 };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Provider Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Kelola API keys dan monitor transaksi customer Anda
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production Key, Development Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateApiKey}
                  disabled={createApiKeyMutation.isPending}
                >
                  {createApiKeyMutation.isPending ? "Creating..." : "Create API Key"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total API Keys</p>
                <p className="text-2xl font-bold">{apiKeys?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{totalStats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalStats.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="documentation">API Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading API keys...</div>
          ) : apiKeys?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No API Keys Found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first API key to start providing services to customers.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First API Key
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {apiKeys?.map((apiKey) => (
                <Card key={apiKey.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{apiKey.keyName}</CardTitle>
                        <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                          {apiKey.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <Switch
                        checked={apiKey.isActive}
                        onCheckedChange={(checked) =>
                          toggleApiKeyMutation.mutate({
                            id: apiKey.id,
                            isActive: checked,
                          })
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type={showApiKey[apiKey.id] ? "text" : "password"}
                          value={apiKey.apiKey}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {showApiKey[apiKey.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.apiKey, "API Key")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Requests</p>
                        <p className="font-semibold">{apiKey.totalRequests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{apiKey.totalOrders.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold">${parseFloat(apiKey.totalRevenue).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Used</p>
                        <p className="font-semibold">
                          {apiKey.lastUsed
                            ? new Date(apiKey.lastUsed).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <p className="text-muted-foreground">
                API Anda kompatibel dengan format standar SMM Panel (idcdigitals.com/SocPanel)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`${window.location.origin}/api/v2`}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(`${window.location.origin}/api/v2`, "Base URL")
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Endpoints</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Get Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Method:</strong> POST</p>
                        <p><strong>Action:</strong> balance</p>
                        <div>
                          <strong>Parameters:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            key=YOUR_API_KEY<br />
                            action=balance
                          </div>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            {`{
  "balance": "100.50",
  "currency": "USD"
}`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Get Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Method:</strong> POST</p>
                        <p><strong>Action:</strong> services</p>
                        <div>
                          <strong>Parameters:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            key=YOUR_API_KEY<br />
                            action=services
                          </div>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            {`[
  {
    "service": 1,
    "name": "Instagram Followers",
    "type": "Default",
    "rate": "0.50",
    "min": 100,
    "max": 10000,
    "category": "Instagram",
    "refill": true,
    "cancel": true
  }
]`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Create Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Method:</strong> POST</p>
                        <p><strong>Action:</strong> add</p>
                        <div>
                          <strong>Parameters:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            key=YOUR_API_KEY<br />
                            action=add<br />
                            service=1<br />
                            link=https://instagram.com/username<br />
                            quantity=1000
                          </div>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            {`{
  "order": "12345"
}`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Check Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Method:</strong> POST</p>
                        <p><strong>Action:</strong> status</p>
                        <div>
                          <strong>Parameters:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            key=YOUR_API_KEY<br />
                            action=status<br />
                            order=12345
                          </div>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                            {`{
  "charge": "5.00",
  "start_count": "1000",
  "status": "Completed",
  "remains": "0",
  "currency": "USD"
}`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}