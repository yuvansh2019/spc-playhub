import { useState } from "react";
import { signup, verify } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignup = () => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const result = signup(email, password);
    setToken(result.token);
    toast({ title: "Signup successful!", description: "Click the verify button below." });
  };

  const handleVerify = () => {
    if (token && verify(token)) {
      setToken(null);
      toast({ title: "Verified!", description: "You can now login." });
    } else {
      toast({ title: "Error", description: "Invalid token", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Create Account</h2>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleSignup} className="w-full">Signup</Button>
        {token && (
          <Button onClick={handleVerify} variant="secondary" className="w-full">
            ✅ Verify Email
          </Button>
        )}
      </div>
    </div>
  );
};

export default Signup;
