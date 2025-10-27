import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StreamSettingsProps {
  onSettingsSaved: () => void;
}

export const StreamSettings = ({ onSettingsSaved }: StreamSettingsProps) => {
  const [rtspUrl, setRtspUrl] = useState("");
  const [streamName, setStreamName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("livestream_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setRtspUrl(data.rtsp_url);
      setStreamName(data.stream_name || "");
    }
  };

  const handleSave = async () => {
    if (!rtspUrl) {
      toast.error("Please enter a stream URL");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("livestream_settings")
      .upsert({
        user_id: user.id,
        rtsp_url: rtspUrl,
        stream_name: streamName,
      });

    setLoading(false);

    if (error) {
      toast.error("Failed to save settings");
      return;
    }

    toast.success("Settings saved successfully");
    onSettingsSaved();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="streamName">Stream Name</Label>
          <Input
            id="streamName"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            placeholder="My Livestream"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rtspUrl">Stream URL (RTSP/HLS)</Label>
          <Input
            id="rtspUrl"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            placeholder="rtsp://example.com/stream or https://example.com/stream.m3u8"
          />
          <p className="text-sm text-muted-foreground">
            For RTSP streams, convert to HLS format for web compatibility
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
