"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "@/components/RichEditor";
import { CATEGORIES, Post, PostStatus } from "@/lib/types";

type Props = {
  mode: "new" | "edit";
  post?: Post;
};

type DraftData = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  tags: string;
  coverImage: string;
  contentHtml: string;
  status: PostStatus;
};

function draftKey(postId: string) {
  return `af_draft_${postId}`;
}

export default function PostForm({ mode, post }: Props) {
  const router = useRouter();
  const draftId = post?.id || "new";

  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || CATEGORIES[0]);
  const [author, setAuthor] = useState(post?.author || "");
  const [tags, setTags] = useState((post?.tags || []).join(", "));
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [contentHtml, setContentHtml] = useState(post?.contentHtml || "");
  const [status, setStatus] = useState<PostStatus>(post?.status || "draft");

  const [autosaveNote, setAutosaveNote] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const restoreChecked = useRef(false);

  // Restaura rascunho local não salvo, se houver e o usuário aceitar.
  useEffect(() => {
    if (restoreChecked.current) return;
    restoreChecked.current = true;
    try {
      const raw = localStorage.getItem(draftKey(draftId));
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      const hasContent = draft.title || draft.contentHtml;
      if (!hasContent) return;
      if (confirm("Encontramos um rascunho não salvo deste post. Restaurar?")) {
        setTitle(draft.title);
        setExcerpt(draft.excerpt);
        setCategory(draft.category);
        setAuthor(draft.author);
        setTags(draft.tags);
        setCoverImage(draft.coverImage);
        setContentHtml(draft.contentHtml);
        setStatus(draft.status);
      } else {
        localStorage.removeItem(draftKey(draftId));
      }
    } catch {
      // rascunho corrompido — ignora
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scheduleAutosave(next: Partial<DraftData>) {
    setAutosaveNote("Salvando rascunho local…");
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      const data: DraftData = {
        title,
        excerpt,
        category,
        author,
        tags,
        coverImage,
        contentHtml,
        status,
        ...next
      };
      localStorage.setItem(draftKey(draftId), JSON.stringify(data));
      setAutosaveNote(
        `Rascunho salvo às ${new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        })}`
      );
    }, 900);
  }

  async function uploadImage(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || "Falha no upload");
    return data.url as string;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, "covers");
      setCoverImage(url);
      scheduleAutosave({ coverImage: url });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no upload da capa.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave() {
    setErro("");
    if (!title.trim()) {
      setErro("Dê um título ao post antes de salvar.");
      return;
    }
    if (!author.trim()) {
      setErro("Informe o nome do autor.");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        title,
        excerpt,
        category,
        author,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage,
        contentHtml,
        status
      };

      const res = await fetch(mode === "new" ? "/api/posts" : `/api/posts/${post!.id}`, {
        method: mode === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Não foi possível salvar o post.");
        return;
      }

      localStorage.removeItem(draftKey(draftId));
      router.push("/admin");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleAutosave({ title: e.target.value });
          }}
          placeholder="Título do post"
          className="focus-ring w-full border-b border-line bg-transparent pb-3 font-display text-3xl outline-none placeholder:text-inkmuted/50"
        />

        <textarea
          value={excerpt}
          onChange={(e) => {
            setExcerpt(e.target.value);
            scheduleAutosave({ excerpt: e.target.value });
          }}
          placeholder="Prévia curta que aparece no feed e na página do post"
          rows={2}
          className="focus-ring w-full resize-none rounded-card border border-line bg-white px-4 py-3 text-sm outline-none placeholder:text-inkmuted/60"
        />

        <RichEditor
          initialHtml={contentHtml}
          onChange={(html) => {
            setContentHtml(html);
            scheduleAutosave({ contentHtml: html });
          }}
          onUploadImage={uploadImage}
        />

        {erro ? (
          <p className="rounded-card bg-alert/10 px-4 py-3 text-sm text-alert">{erro}</p>
        ) : null}
      </div>

      <aside className="space-y-5">
        <div className="rounded-card border border-line bg-white p-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkmuted">
            Imagem de capa
          </h4>
          <label className="focus-ring flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-line bg-base text-center text-xs text-inkmuted">
            {uploadingCover ? (
              "Enviando…"
            ) : coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              "Clique para enviar a capa"
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>

        <div className="rounded-card border border-line bg-white p-5">
          <Field label="Categoria">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                scheduleAutosave({ category: e.target.value });
              }}
              className="focus-ring w-full rounded-sm border border-line px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Autor">
            <input
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                scheduleAutosave({ author: e.target.value });
              }}
              placeholder="Nome de quem está publicando"
              className="focus-ring w-full rounded-sm border border-line px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Tags (separadas por vírgula)">
            <input
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
                scheduleAutosave({ tags: e.target.value });
              }}
              placeholder="minimalismo, alfaiataria"
              className="focus-ring w-full rounded-sm border border-line px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Status">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatus("draft");
                  scheduleAutosave({ status: "draft" });
                }}
                className={`focus-ring flex-1 rounded-sm border px-3 py-2 text-xs font-medium transition ${
                  status === "draft"
                    ? "border-ink bg-ink text-base"
                    : "border-line text-inkmuted hover:border-ink"
                }`}
              >
                Rascunho
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus("published");
                  scheduleAutosave({ status: "published" });
                }}
                className={`focus-ring flex-1 rounded-sm border px-3 py-2 text-xs font-medium transition ${
                  status === "published"
                    ? "border-golddeep bg-golddeep text-white"
                    : "border-line text-inkmuted hover:border-golddeep"
                }`}
              >
                Publicado
              </button>
            </div>
          </Field>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={salvando}
            className="focus-ring w-full rounded-full bg-ink py-3 text-sm font-semibold text-base transition hover:bg-golddeep disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Salvar post"}
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="focus-ring w-full rounded-full border border-line py-3 text-sm text-inkmuted transition hover:border-ink hover:text-ink"
          >
            Cancelar
          </button>
          {autosaveNote ? <p className="text-center text-xs text-inkmuted">{autosaveNote}</p> : null}
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block text-sm font-medium text-ink last:mb-0">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
