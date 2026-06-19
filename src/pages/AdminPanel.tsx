import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, FileText, ExternalLink, X, Database, Search } from "lucide-react";

import { getAccessToken } from "@/lib/auth";
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

// Step 2 — KB documents + slides (selection UI)
interface SlidePage {
  page_number: number;
  page_key: string;
  template_doc_id?: string | null;
  embedded: boolean;
}

interface KbDocument {
  doc_id: string;
  file_name: string;
  num_slides: number;
  kb_file_link?: string | null;
  pages: SlidePage[];
}

// Step 2 — vectorize response
interface VectorizeResponse {
  processed: number;
  failed: number;
  force: boolean;
  total_in_collection: number;
  indexes: Record<string, string>; // {field: "created"|"exists"|"error: ..."}
}

// Step 3 — retrieve hit + response (production /kb/retrieve contract)
interface LlmReasoning {
  slide_doc_id?: string;
  is_strong_match?: boolean;
  match_quality?: string;
  reasoning?: string;
  key_alignments?: string[];
  gaps?: string[];
}

interface RetrieveHit {
  slide_doc_id: string;
  template_id: string;
  score: number;
  layout_family?: string | null;
  section_label?: string | null;
  "File-Type"?: string | null;
  raw_file_doc_id?: string | null;
  raw_file_link?: string | null;
  thumbnail_blob_key?: string | null;
  content_summary?: string | null;
  slide_detailed_info: string; // secure link to the full document
  llm_reasoning?: LlmReasoning | null;
}

interface RetrieveResponse {
  query: string;
  vector_field: string;
  count: number;
  results: RetrieveHit[];
}

const EMBED_FIELDS = ["visual_layout_text", "use_cases", "tags", "notes"] as const;
type VectorField = (typeof EMBED_FIELDS)[number];

const AdminPanel = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<KbUploadResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Step 2: vectorize state ───────────────────────────────────────────────
  const [docs, setDocs] = useState<KbDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  // selected[doc_id] = "all" (every slide) | number[] (specific slide numbers)
  const [selected, setSelected] = useState<Record<string, "all" | number[]>>({});
  const [vectorizing, setVectorizing] = useState(false);
  const [force, setForce] = useState(false);
  const [vectorizeResult, setVectorizeResult] = useState<VectorizeResponse | null>(null);

  // ── Step 3: retrieve state ────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [vectorField, setVectorField] = useState<VectorField>("visual_layout_text");
  const [topK, setTopK] = useState(5);
  const [filterText, setFilterText] = useState("");
  const [withReasoning, setWithReasoning] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [retrieving, setRetrieving] = useState(false);
  const [retrieveResults, setRetrieveResults] = useState<RetrieveHit[] | null>(null);

  // Load the KB documents once on mount (admin access is enforced by AdminLayout).
  useEffect(() => {
    loadDocuments();
  }, []);

  // ── Load KB documents (files + slides) for the vectorize picker ───────────
  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/kb/documents`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (!res.ok) throw new Error(`Failed to load documents (${res.status}).`);
      const data = await res.json();
      setDocs(data?.documents ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoadingDocs(false);
    }
  };

  // ── Slide selection helpers ───────────────────────────────────────────────
  const isFileSelected = (docId: string) => docId in selected;
  const isAllSlides = (docId: string) => selected[docId] === "all";
  const isPageSelected = (docId: string, p: number) => {
    const sel = selected[docId];
    if (sel === undefined) return false;
    if (sel === "all") return true;
    return sel.includes(p);
  };

  const toggleFile = (doc: KbDocument) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (doc.doc_id in next) delete next[doc.doc_id];
      else next[doc.doc_id] = "all";
      return next;
    });
  };

  const selectAllSlides = (docId: string) => {
    setSelected((prev) => ({ ...prev, [docId]: "all" }));
  };

  const togglePage = (doc: KbDocument, p: number) => {
    setSelected((prev) => {
      const cur = prev[doc.doc_id];
      const allPages = doc.pages.map((pg) => pg.page_number);
      let arr = cur === "all" || cur === undefined ? [...allPages] : [...cur];
      arr = arr.includes(p) ? arr.filter((x) => x !== p) : [...arr, p];
      arr.sort((a, b) => a - b);
      const isAll = arr.length === allPages.length;
      return { ...prev, [doc.doc_id]: isAll ? "all" : arr };
    });
  };

  const buildSelections = () =>
    Object.entries(selected).map(([doc_id, sel]) => ({
      doc_id,
      pages: sel === "all" ? null : sel,
    }));

  const selectedSlideCount = () =>
    Object.entries(selected).reduce((n, [docId, sel]) => {
      const doc = docs.find((d) => d.doc_id === docId);
      return n + (sel === "all" ? doc?.pages.length ?? 0 : (sel as number[]).length);
    }, 0);

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
      loadDocuments(); // refresh the vectorize picker with the newly-ingested slides
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ── Step 2: vectorize ─────────────────────────────────────────────────────
  const handleVectorize = async () => {
    const selections = buildSelections();
    if (selections.length === 0) {
      toast.error("Select at least one file (or specific slides) to vectorize.");
      return;
    }
    setVectorizing(true);
    setVectorizeResult(null);
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/kb/vectorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ selections, force }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Vectorize failed (${res.status}).`);
      }
      const data: VectorizeResponse = await res.json();
      setVectorizeResult(data);
      const idxErrors = Object.values(data.indexes || {}).filter((s) =>
        s.startsWith("error"),
      ).length;
      if (idxErrors > 0) {
        toast.warning(
          `Embedded ${data.processed} slide(s), but the vector index reported an error.`,
        );
      } else {
        toast.success(
          `Embedded ${data.processed} slide(s) (${data.failed} failed). Index ensured.`,
        );
      }
      loadDocuments(); // refresh embedded status
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Vectorize failed.");
    } finally {
      setVectorizing(false);
    }
  };

  // ── Step 3: retrieve ──────────────────────────────────────────────────────
  const handleRetrieve = async () => {
    if (!query.trim()) {
      toast.error("Enter a query to search.");
      return;
    }

    // Parse the optional metadata filter (JSON object → Atlas $vectorSearch pre-filter).
    let filterObj: Record<string, unknown> | null = null;
    const trimmedFilter = filterText.trim();
    if (trimmedFilter) {
      try {
        filterObj = JSON.parse(trimmedFilter);
        if (typeof filterObj !== "object" || Array.isArray(filterObj)) {
          throw new Error("Filter must be a JSON object.");
        }
      } catch (err) {
        toast.error(`Invalid filter JSON: ${err instanceof Error ? err.message : "parse error"}`);
        return;
      }
    }

    setRetrieving(true);
    setRetrieveResults(null);
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/kb/test-retrieve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          query: query.trim(),
          vector_field: vectorField,
          top_k: topK,
          filter: filterObj,
          with_llm_reasoning: withReasoning,
          additional_information: withReasoning ? additionalInfo.trim() || null : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Retrieve failed (${res.status}).`);
      }
      const data: RetrieveResponse = await res.json();
      setRetrieveResults(data.results ?? []);
      toast.success(`Found ${data.count ?? data.results?.length ?? 0} hit(s) on ${vectorField}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Retrieve failed.");
    } finally {
      setRetrieving(false);
    }
  };

  // Open a result's full document via its secure detail link (sends the admin Bearer token).
  const openSlideDetail = async (link: string) => {
    try {
      const res = await fetch(link, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (!res.ok) throw new Error(`Detail fetch failed (${res.status}).`);
      const doc = await res.json();
      const win = window.open("", "_blank");
      if (win) {
        win.document.title = "Slide template document";
        win.document.body.style.cssText = "margin:0;background:#0b1021;color:#d6e1ff;";
        const pre = win.document.createElement("pre");
        pre.style.cssText = "padding:16px;font:12px/1.5 monospace;white-space:pre-wrap;word-break:break-word;";
        pre.textContent = JSON.stringify(doc, null, 2);
        win.document.body.appendChild(pre);
      } else {
        toast.message("Pop-up blocked — logged document to console.");
        console.log(doc);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load slide detail.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Upload PDF, PPT, or PPTX files, vectorize slide templates, and test retrieval.
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

      {/* ── Step 2: Vectorize ─────────────────────────────────────────────── */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Step 2 — Vectorize slide templates
          </CardTitle>
          <CardDescription>
            Embed each slide's four fields (visual layout, use cases, tags, notes) and ensure the
            MongoDB Atlas vector indexes. Runs only on slides missing embeddings unless you force a
            full re-embed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Select file(s), then all slides or specific ones.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDocuments}
              disabled={loadingDocs || vectorizing}
            >
              {loadingDocs ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Refresh
            </Button>
          </div>

          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {loadingDocs ? "Loading files…" : "No files yet — upload PPTX files above first."}
            </p>
          ) : (
            <ul className="space-y-2">
              {docs.map((doc) => {
                const fileSelected = isFileSelected(doc.doc_id);
                const embeddedCount = doc.pages.filter((p) => p.embedded).length;
                return (
                  <li key={doc.doc_id} className="rounded-md border p-3">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={fileSelected}
                        onChange={() => toggleFile(doc)}
                        disabled={vectorizing}
                        className="h-4 w-4"
                      />
                      <span className="truncate">{doc.file_name}</span>
                      <Badge variant="secondary">
                        {embeddedCount}/{doc.pages.length} embedded
                      </Badge>
                    </label>

                    {fileSelected && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pl-6">
                        <button
                          type="button"
                          onClick={() => selectAllSlides(doc.doc_id)}
                          disabled={vectorizing}
                          className={`rounded-full border px-2.5 py-0.5 text-xs ${
                            isAllSlides(doc.doc_id)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          All slides
                        </button>
                        {doc.pages.map((pg) => {
                          const on = isPageSelected(doc.doc_id, pg.page_number);
                          return (
                            <button
                              key={pg.page_key}
                              type="button"
                              onClick={() => togglePage(doc, pg.page_number)}
                              disabled={vectorizing}
                              title={pg.embedded ? "Already embedded" : "Not embedded yet"}
                              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                                on ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                              } ${pg.embedded ? "ring-1 ring-green-500/50" : ""}`}
                            >
                              {pg.page_number}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              disabled={vectorizing}
              className="h-4 w-4"
            />
            Force re-embed selected slides (ignore existing embeddings)
          </label>

          <Button
            onClick={handleVectorize}
            disabled={vectorizing || Object.keys(selected).length === 0}
          >
            {vectorizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vectorizing…
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" /> Vectorize ({selectedSlideCount()} slides)
              </>
            )}
          </Button>

          {vectorizeResult && (
            <div className="rounded-md border p-3 text-sm">
              <p>
                Processed <strong>{vectorizeResult.processed}</strong> · Failed{" "}
                <strong>{vectorizeResult.failed}</strong> · Collection total{" "}
                <strong>{vectorizeResult.total_in_collection}</strong>
                {vectorizeResult.force ? " · forced" : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(vectorizeResult.indexes).map(([field, state]) => (
                  <Badge
                    key={field}
                    variant={state.startsWith("error") ? "destructive" : "secondary"}
                  >
                    {field}: {state}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Atlas builds vector indexes asynchronously — wait until they are READY before retrieving.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Step 3: Retrieve ──────────────────────────────────────────────── */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> Step 3 — Semantic retrieve
          </CardTitle>
          <CardDescription>
            Test the production <code>/kb/retrieve</code> route. Pick one embedded field, optionally apply
            a metadata filter, and toggle LLM reasoning. Returns a single ranked list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-muted-foreground">Query</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !retrieving && handleRetrieve()}
                placeholder="e.g. cover / title slide, KPI dashboard, timeline…"
                disabled={retrieving}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="w-48">
              <label className="mb-1 block text-sm text-muted-foreground">Vector field</label>
              <select
                value={vectorField}
                onChange={(e) => setVectorField(e.target.value as VectorField)}
                disabled={retrieving}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {EMBED_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="mb-1 block text-sm text-muted-foreground">Top K</label>
              <input
                type="number"
                min={1}
                max={50}
                value={topK}
                onChange={(e) => setTopK(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                disabled={retrieving}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-muted-foreground">
              Filter (JSON, optional) — e.g. {`{ "File-Type": "repository", "layout_family": "title" }`}
            </label>
            <textarea
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={`{ "layout_family": "title", "tags": { "$in": ["kpi"] } }`}
              disabled={retrieving}
              rows={2}
              className="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={withReasoning}
                onChange={(e) => setWithReasoning(e.target.checked)}
                disabled={retrieving}
              />
              With LLM Reasoning
            </label>
            {withReasoning && (
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Additional information for the reasoning model (optional)…"
                disabled={retrieving}
                rows={2}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            )}
          </div>

          <Button onClick={handleRetrieve} disabled={retrieving || !query.trim()}>
            {retrieving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Search
              </>
            )}
          </Button>

          {retrieveResults && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">
                {vectorField}{" "}
                <span className="text-muted-foreground">({retrieveResults.length})</span>
              </h3>
              {retrieveResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hits.</p>
              ) : (
                <div className="space-y-3">
                  {retrieveResults.map((h) => (
                    <div key={h.slide_doc_id} className="rounded-md border p-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">score {h.score?.toFixed(3)}</Badge>
                        <Badge variant="outline">{h.layout_family ?? "—"}</Badge>
                        <Badge variant="outline">{h.section_label ?? "—"}</Badge>
                        {h.llm_reasoning?.match_quality && (
                          <Badge
                            variant={
                              h.llm_reasoning.is_strong_match ? "default" : "secondary"
                            }
                          >
                            {h.llm_reasoning.match_quality}
                          </Badge>
                        )}
                        <div className="ml-auto flex items-center gap-3">
                          {h.raw_file_link && (
                            <a
                              href={h.raw_file_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              Open file <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <button
                            onClick={() => openSlideDetail(h.slide_detailed_info)}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            Open detail <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {h.content_summary ?? "—"}
                      </p>
                      {h.llm_reasoning && (
                        <div className="mt-2 rounded bg-muted/50 p-2">
                          <p className="text-foreground">{h.llm_reasoning.reasoning}</p>
                          {!!h.llm_reasoning.key_alignments?.length && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              <span className="font-semibold">Aligns:</span>{" "}
                              {h.llm_reasoning.key_alignments.join("; ")}
                            </p>
                          )}
                          {!!h.llm_reasoning.gaps?.length && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              <span className="font-semibold">Gaps:</span>{" "}
                              {h.llm_reasoning.gaps.join("; ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
