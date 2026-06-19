import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound, Copy, Trash2, RefreshCw } from "lucide-react";

import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface ApiKey {
  id: string;
  key: string;
  service: string;
  owner: string;
  active: boolean;
  created_at: string;
  last_used_at?: string | null;
  usage_count: number;
}

const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

const copy = (value: string) => {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success("Copied to clipboard."))
    .catch(() => toast.error("Could not copy."));
};

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString() : "—";

/** API-key management: create a key for a service, monitor all keys, and deactivate them. */
const AdminApiKeys = () => {
  const [service, setService] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/monitor/api-keys`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to load keys (${res.status}).`);
      setKeys(await res.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load keys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreate = async () => {
    if (!service.trim()) {
      toast.error("Enter a service name for the key.");
      return;
    }
    setCreating(true);
    setNewKey(null);
    try {
      const res = await fetch(
        `${BACKEND_API_URL}/admin/create-key?service=${encodeURIComponent(service.trim())}`,
        { method: "POST", headers: authHeaders() },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || `Create failed (${res.status}).`);
      setNewKey(data.key);
      setService("");
      toast.success("API key created. Copy it now — it is shown only once.");
      loadKeys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (id: string, svc: string) => {
    if (!window.confirm(`Deactivate the API key for "${svc}"? Clients using it will stop working.`)) {
      return;
    }
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/api-key?key_id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Deactivate failed (${res.status}).`);
      }
      toast.success("API key deactivated.");
      loadKeys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deactivate failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage keys that authorize external services to call <code>/kothar_fn/kb/retrieve</code>.
        </p>
      </div>

      {/* Create */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Create a key
          </CardTitle>
          <CardDescription>
            Name the service the key is for (e.g. <code>kothar_fn</code>, <code>prod</code>, an Azure function).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-muted-foreground">Service</label>
              <Input
                value={service}
                onChange={(e) => setService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !creating && handleCreate()}
                placeholder="e.g. kothar_fn"
                disabled={creating}
              />
            </div>
            <Button onClick={handleCreate} disabled={creating || !service.trim()}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" /> Create key
                </>
              )}
            </Button>
          </div>

          {newKey && (
            <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
              <p className="mb-2 font-medium text-amber-700 dark:text-amber-400">
                Copy this key now — it is shown in full only once.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded bg-background px-2 py-1 font-mono text-xs">
                  {newKey}
                </code>
                <Button variant="outline" size="sm" onClick={() => copy(newKey)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All keys</CardTitle>
              <CardDescription>Stored encrypted; the value below is decrypted for you.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadKeys} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.service}</TableCell>
                    <TableCell>{k.owner}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="max-w-[160px] truncate font-mono text-xs" title={k.key}>
                          {k.key}
                        </code>
                        <button
                          onClick={() => copy(k.key)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Copy key"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={k.active ? "default" : "secondary"}>
                        {k.active ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{k.usage_count}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {fmtDate(k.last_used_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {k.active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivate(k.id, k.service)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Deactivate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApiKeys;
