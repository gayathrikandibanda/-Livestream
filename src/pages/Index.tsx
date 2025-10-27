import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthPage } from "@/components/auth/AuthPage";
import { VideoPlayer } from "@/components/livestream/VideoPlayer";
import { OverlayEditor } from "@/components/overlay/OverlayEditor";
import { StreamSettings } from "@/components/livestream/StreamSettings";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Overlay {
  id: string;
  name: string;
  type: string;
  content?: string;
  image_url?: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  font_size?: number;
  color?: string;
}

interface LivestreamSettings {
  rtsp_url: string;
  stream_name?: string;
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [settings, setSettings] = useState<LivestreamSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadData();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await loadData();
    }
    setLoading(false);
  };

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [overlaysResult, settingsResult] = await Promise.all([
      supabase.from("overlays").select("*").eq("user_id", user.id),
      supabase.from("livestream_settings").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    if (overlaysResult.data) {
      setOverlays(overlaysResult.data);
    }

    if (settingsResult.data) {
      setSettings(settingsResult.data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Livestream Overlay Manager</h1>
            <p className="text-sm text-muted-foreground">
              Manage your livestreams with custom overlays
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="stream" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stream">Livestream</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stream">
            {settings?.rtsp_url ? (
              <VideoPlayer streamUrl={settings.rtsp_url} overlays={overlays} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No stream configured yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Go to Settings tab to configure your stream URL
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overlays">
            <OverlayEditor overlays={overlays} onOverlaysChange={loadData} />
          </TabsContent>

          <TabsContent value="settings">
            <StreamSettings onSettingsSaved={loadData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
