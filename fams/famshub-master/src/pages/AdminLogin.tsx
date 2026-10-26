import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-admin', {
        body: { secret }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Set the session
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      toast({ title: "Admin access granted!" });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid admin secret",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="FAM's Apple Hub" className="h-16 w-auto mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="h-6 w-6 text-primary" />
            <CardTitle>Admin Access</CardTitle>
          </div>
          <CardDescription>
            Enter the admin secret to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
