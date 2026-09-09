"use client";

import { useEffect, useRef } from "react";

type RichEditorProps = {
  initialHtml: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File, folder: string) => Promise<string>;
};

const TOOLS: { label: string; title: string; cmd: string; val?: string }[] = [
  { label: "B", title: "Negrito", cmd: "bold" },
  { label: "I", title: "Itálico", cmd: "italic" },
  { label: "U", title: "Sublinhado", cmd: "underline" }
];

export default function RichEditor({ initialHtml, onChange, onUploadImage }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = initialHtml || "<p><br></p>";
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emitChange() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function cmd(command: string, val?: string) {
    focusEditor();
    document.execCommand(command, false, val);
    emitChange();
  }

  function insertLink() {
    const url = prompt("Endereço do link (https://...)");
    if (url) cmd("createLink", url);
  }

  function insertHtmlAtCursor(html: string) {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    emitChange();
  }

  function extractYoutubeId(input: string): string | null {
    const iframeSrcMatch = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (iframeSrcMatch) return iframeSrcMatch[1];
    const urlMatch = input.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    if (urlMatch) return urlMatch[1];
    return null;
  }

  function insertVideo() {
    const input = prompt(
      "Cole o link do YouTube (ou o código de incorporação completo):"
    );
    if (!input) return;
    const id = extractYoutubeId(input);
    if (!id) {
      alert("Não consegui reconhecer um link do YouTube válido nesse texto.");
      return;
    }
    const html = `<div class="video-embed" contenteditable="false"><iframe src="https://www.youtube.com/embed/${id}" title="Vídeo incorporado" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><p><br></p>`;
    insertHtmlAtCursor(html);
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await onUploadImage(file, "content");
    const html = `<figure class="editor-image" contenteditable="false"><img src="${url}" alt=""><figcaption contenteditable="true" data-placeholder="Legenda (opcional)"></figcaption></figure><p><br></p>`;
    insertHtmlAtCursor(html);
  }

  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const urls = await Promise.all(files.map((f) => onUploadImage(f, "gallery")));
    const imgs = urls.map((u) => `<img src="${u}" alt="">`).join("");
    const html = `<div class="gallery-carousel" contenteditable="false"><div class="gallery-track">${imgs}</div></div><p><br></p>`;
    insertHtmlAtCursor(html);
  }

  return (
    <div className="rounded-card border border-line bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-2">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => cmd(t.cmd, t.val)}
            className="focus-ring h-8 w-8 rounded-sm text-sm font-semibold text-ink transition hover:bg-base"
          >
            {t.label}
          </button>
        ))}
        <Divider />
        <button
          type="button"
          title="Título H2"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("formatBlock", "h2")}
          className="focus-ring h-8 rounded-sm px-2 text-xs font-semibold text-ink transition hover:bg-base"
        >
          H2
        </button>
        <button
          type="button"
          title="Título H3"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("formatBlock", "h3")}
          className="focus-ring h-8 rounded-sm px-2 text-xs font-semibold text-ink transition hover:bg-base"
        >
          H3
        </button>
        <button
          type="button"
          title="Parágrafo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("formatBlock", "p")}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          P
        </button>
        <button
          type="button"
          title="Citação em destaque"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("formatBlock", "blockquote")}
          className="focus-ring h-8 rounded-sm px-2 text-sm text-ink transition hover:bg-base"
        >
          &ldquo;&rdquo;
        </button>
        <Divider />
        <button
          type="button"
          title="Lista com marcadores"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("insertUnorderedList")}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          • Lista
        </button>
        <button
          type="button"
          title="Lista numerada"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("insertOrderedList")}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          1. Lista
        </button>
        <Divider />
        <button
          type="button"
          title="Alinhar à esquerda"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("justifyLeft")}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          ⟸
        </button>
        <button
          type="button"
          title="Centralizar"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd("justifyCenter")}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          ⟺
        </button>
        <Divider />
        <button
          type="button"
          title="Inserir link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          Link
        </button>
        <button
          type="button"
          title="Inserir imagem"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => imgInputRef.current?.click()}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          + Imagem
        </button>
        <button
          type="button"
          title="Inserir galeria (carrossel)"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => galleryInputRef.current?.click()}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          + Galeria
        </button>
        <button
          type="button"
          title="Inserir vídeo do YouTube"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertVideo}
          className="focus-ring h-8 rounded-sm px-2 text-xs text-ink transition hover:bg-base"
        >
          + Vídeo
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-body min-h-[360px] px-5 py-5"
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        data-placeholder="Escreva o post…"
      />

      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleGalleryFiles}
      />
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-line" />;
}
