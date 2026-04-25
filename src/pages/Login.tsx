import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadProgressFromCloud } from "@/lib/levels";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/go-to";
  const goToAdmin = redirect === "/admin";

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    await loadProgressFromCloud();
    toast({ title: "Welcome back!" });
    navigate(redirect);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Login</h2>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
        <label className="flex items-center gap-2 text-sm text-foreground bg-muted/50 rounded-md px-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={goToAdmin}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.checked) params.set("redirect", "/admin");
              else params.delete("redirect");
              setSearchParams(params);
            }}
          />
          Go to admin after login
        </label>
        <p className="text-xs text-muted-foreground text-center">
          Will redirect to: <span className="text-primary">{redirect}</span>
        </p>
        <p className="text-sm text-muted-foreground text-center">
          No account? <Link to="/signup" className="text-primary underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
