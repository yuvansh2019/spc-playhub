import { useState } from "react";
import { login } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (login(email, password)) {
      toast({ title: "Login successful!" });
      navigate("/game");
    } else {
      toast({ title: "Login failed", description: "Invalid credentials or unverified account.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Login</h2>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} className="w-full">Login</Button>
      </div>
    </div>
  );
};

export default Login;
