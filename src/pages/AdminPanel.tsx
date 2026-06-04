import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload, FileText, ExternalLink, X } from "lucide-react";

import { getAuth, getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const ACCEPTED = ".pdf,.ppt,.pptx";

interface KbUploadResult {
  fileName: string;
  status: "success" | "error";
  kbFileLink?: string | null;
  documentId?: string | null;
  created?: boolean | null;
  message: string;
}

type AccessState = "checking" | "granted" | "denied";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [access, setAccess] = useState<AccessState>("checking");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<KbUploadResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Verify admin access on mount ──────────────────────────────────────────
  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      navigate("/auth");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAdminEmail(data?.email ?? auth.email);
          setAccess("granted");
        } else {
          setAccess("denied");
        }
      } catch {
        setAccess("denied");
      }
    })();
  }, [navigate]);

  // ── File selection helpers ────────────────────────────────────────────────
  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    const incoming = Array.from(selected);
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name));
      return [...prev, ...incoming.filter((f) => !seen.has(f.name))];
    });
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  // ── Upload ──────────────────────────────────────────────────────────────--
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    setUploading(true);
    setResults([]);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));

      const res = await fetch(`${BACKEND_API_URL}/admin/kb/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Upload failed (${res.status}).`);
      }

      const data = await res.json();
      const uploaded: KbUploadResult[] = data?.results ?? [];
      setResults(uploaded);

      const ok = uploaded.filter((r) => r.status === "success").length;
      const failed = uploaded.length - ok;
      if (failed === 0) {
        toast.success(`Uploaded ${ok} file${ok === 1 ? "" : "s"} successfully.`);
      } else {
        toast.warning(`${ok} succeeded, ${failed} failed. See results below.`);
      }
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ── Render states ──────────────────────────────────────────────────────---
  if (access === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (access === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Not authorized</CardTitle>
            <CardDescription>
              Your account does not have access to the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Panel — Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {adminEmail}. Upload PDF, PPT, or PPTX files to the knowledge base.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload files</CardTitle>
          <CardDescription>You can select one or multiple files at once.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED}
            onChange={(e) => addFiles(e.target.files)}
            disabled={uploading}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
          />

          {files.length > 0 && (
            <ul className="space-y-1">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    disabled={uploading}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload{" "}
                {files.length > 0 ? `(${files.length})` : ""}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.fileName}>
                    <TableCell className="max-w-[260px] truncate">{r.fileName}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "success" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.status === "success"
                        ? r.created
                          ? "Created"
                          : "Updated"
                        : r.message}
                    </TableCell>
                    <TableCell>
                      {r.kbFileLink ? (
                        <a
                          href={r.kbFileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;
