import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface OverlayEditorProps {
  overlays: Overlay[];
  onOverlaysChange: () => void;
}

export const OverlayEditor = ({ overlays, onOverlaysChange }: OverlayEditorProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("text");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [positionX, setPositionX] = useState("50");
  const [positionY, setPositionY] = useState("50");
  const [width, setWidth] = useState("100");
  const [height, setHeight] = useState("100");
  const [fontSize, setFontSize] = useState("16");
  const [color, setColor] = useState("#ffffff");

  const handleCreate = async () => {
    if (!name) {
      toast.error("Please enter an overlay name");
      return;
    }

    if (type === "text" && !content) {
      toast.error("Please enter text content");
      return;
    }

    if ((type === "logo" || type === "image") && !imageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("overlays").insert({
      user_id: user.id,
      name,
      type,
      content: type === "text" ? content : null,
      image_url: type !== "text" ? imageUrl : null,
      position_x: parseFloat(positionX),
      position_y: parseFloat(positionY),
      width: parseFloat(width),
      height: parseFloat(height),
      font_size: type === "text" ? parseInt(fontSize) : null,
      color: type === "text" ? color : null,
    });

    if (error) {
      toast.error("Failed to create overlay");
      console.error(error);
      return;
    }

    toast.success("Overlay created successfully");
    setName("");
    setContent("");
    setImageUrl("");
    onOverlaysChange();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("overlays").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete overlay");
      return;
    }

    toast.success("Overlay deleted");
    onOverlaysChange();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Overlay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Overlay Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Overlay"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="logo">Logo</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "text" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Text Content</Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positionX">Position X</Label>
              <Input
                id="positionX"
                type="number"
                value={positionX}
                onChange={(e) => setPositionX(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionY">Position Y</Label>
              <Input
                id="positionY"
                type="number"
                value={positionY}
                onChange={(e) => setPositionY(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleCreate} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Overlay
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Overlays</CardTitle>
        </CardHeader>
        <CardContent>
          {overlays.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No overlays created yet
            </p>
          ) : (
            <div className="space-y-2">
              {overlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div>
                    <p className="font-medium">{overlay.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {overlay.type} - Position: ({overlay.position_x}, {overlay.position_y})
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(overlay.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
