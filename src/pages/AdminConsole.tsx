import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Shield, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_PIN = "1108";

interface AccountRow {
  id: string;
  display_name: string;
  created_at: string;
  unlocked_level: number | null;
  total_score: number;
  is_admin: boolean;
}

const AdminConsole = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AccountRow | null>(null);
  const [scores, setScores] = useState<{ id: string; name: string; score: number; category: string; created_at: string }[]>([]);
  const [newLevel, setNewLevel] = useState("");

  // Check admin role whenever user changes
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const handleUnlock = () => {
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setPin("");
    } else {
      toast({ title: "Incorrect PIN", variant: "destructive" });
    }
  };

  const promoteSelf = async () => {
    if (!user) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "You are now an admin." });
      setIsAdmin(true);
    }
  };

  const loadAccounts = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: progress }, { data: allScores }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, created_at"),
      supabase.from("player_progress").select("user_id, unlocked_level"),
      supabase.from("leaderboard_scores").select("user_id, score"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const progMap = new Map((progress ?? []).map((p) => [p.user_id, p.unlocked_level]));
    const scoreMap = new Map<string, number>();
    (allScores ?? []).forEach((s) => {
      if (!s.user_id) return;
      scoreMap.set(s.user_id, (scoreMap.get(s.user_id) ?? 0) + Number(s.score));
    });
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));

    const rows: AccountRow[] = (profiles ?? []).map((p) => ({
      id: p.id,
      display_name: p.display_name,
      created_at: p.created_at,
      unlocked_level: progMap.get(p.id) ?? null,
      total_score: scoreMap.get(p.id) ?? 0,
      is_admin: adminSet.has(p.id),
    }));
    rows.sort((a, b) => b.total_score - a.total_score);
    setAccounts(rows);
    setLoading(false);
  };

  useEffect(() => {
    if (unlocked && isAdmin) loadAccounts();
  }, [unlocked, isAdmin]);

  const openAccount = async (acc: AccountRow) => {
    setSelected(acc);
    setNewLevel(String(acc.unlocked_level ?? 1));
    const { data } = await supabase
      .from("leaderboard_scores")
      .select("id, name, score, category, created_at")
      .eq("user_id", acc.id)
      .order("created_at", { ascending: false });
    setScores((data ?? []).map((d) => ({ ...d, score: Number(d.score) })));
  };

  const updateLevel = async () => {
    if (!selected) return;
    const lvl = parseInt(newLevel, 10);
    if (isNaN(lvl) || lvl < 1 || lvl > 6) {
      toast({ title: "Level must be 1-6", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("player_progress")
      .update({ unlocked_level: lvl, updated_at: new Date().toISOString() })
      .eq("user_id", selected.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Set ${selected.display_name} to level ${lvl}` });
      loadAccounts();
      setSelected({ ...selected, unlocked_level: lvl });
    }
  };

  const deleteScore = async (id: string) => {
    const { error } = await supabase.from("leaderboard_scores").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setScores(scores.filter((s) => s.id !== id));
      toast({ title: "Score deleted" });
    }
  };

  const toggleAdmin = async (acc: AccountRow) => {
    if (acc.is_admin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", acc.id).eq("role", "admin");
      if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: acc.id, role: "admin" });
      if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    }
    loadAccounts();
  };

  // ---------- Render ----------
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-6 w-6" /></Link>
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl text-primary">Admin Console</h2>
        <p className="text-muted-foreground">You must be logged in.</p>
        <Link to="/login.page?redirect=/admin"><Button>Log in</Button></Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-6 w-6" /></Link>
        <Lock className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl text-primary">Admin Console</h2>
        <p className="text-sm text-muted-foreground">Enter admin PIN</p>
        <Input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          className="w-40 text-center"
          maxLength={4}
        />
        <Button onClick={handleUnlock}>Unlock</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-6 w-6" /></Link>
        <Shield className="h-16 w-16 text-accent" />
        <h2 className="text-2xl text-primary">Promote to Admin</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Your account doesn't have admin privileges yet. Since you entered the correct PIN, you can grant
          yourself the admin role.
        </p>
        <Button onClick={promoteSelf}>Make me admin</Button>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-6 w-6" /></Link>

      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl text-primary">Admin Console</h1>
          <Button variant="ghost" size="sm" onClick={loadAccounts} className="ml-auto gap-1">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Accounts list */}
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">All accounts ({accounts.length})</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => openAccount(acc)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selected?.id === acc.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {acc.display_name}
                          {acc.is_admin && <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">admin</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Level {acc.unlocked_level ?? 1} · {acc.total_score.toLocaleString()} pts
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(acc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account details */}
          <div className="bg-card border rounded-lg p-4">
            {!selected ? (
              <p className="text-muted-foreground text-center py-8">Select an account to manage it.</p>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-1">{selected.display_name}</h2>
                <p className="text-xs text-muted-foreground mb-4 break-all">ID: {selected.id}</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Unlocked level (1-6)</label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" min={1} max={6} value={newLevel} onChange={(e) => setNewLevel(e.target.value)} />
                      <Button onClick={updateLevel}>Save</Button>
                    </div>
                  </div>

                  <div>
                    <Button variant="outline" size="sm" onClick={() => toggleAdmin(selected)}>
                      {selected.is_admin ? "Revoke admin" : "Grant admin"}
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Scores ({scores.length})</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {scores.length === 0 && <p className="text-xs text-muted-foreground">No scores.</p>}
                      {scores.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm border rounded px-2 py-1">
                          <span>
                            <strong>{s.score.toLocaleString()}</strong>
                            <span className="text-muted-foreground"> · {s.category} · {s.name}</span>
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => deleteScore(s.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
