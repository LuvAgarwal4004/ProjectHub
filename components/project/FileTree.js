"use client";

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  AlertTriangle,
  Flag,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";

function buildTree(files) {
  const root = { type: "folder", name: "", children: {}, files: [] };

  for (const file of files) {
    const path = file.path || file.name;
    const parts = path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      if (isFile) {
        current.files.push(file);
        return;
      }
      if (!current.children[part]) {
        current.children[part] = { type: "folder", name: part, children: {}, files: [] };
      }
      current = current.children[part];
    });
  }

  return root;
}

export default function FileTree({
  files,
  onOpenFile,
  onMarkError,
  canMarkErrors,
  onDeleteFile,
  canEdit,
}) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs font-body">
      <TreeFolder
        node={tree}
        level={0}
        onOpenFile={onOpenFile}
        onMarkError={onMarkError}
        canMarkErrors={canMarkErrors}
        onDeleteFile={onDeleteFile}
        canEdit={canEdit}
      />
    </div>
  );
}

function TreeFolder({ node, level, onOpenFile, onMarkError, canMarkErrors, onDeleteFile, canEdit }) {
  const folders = Object.values(node.children).sort((a, b) => a.name.localeCompare(b.name));
  const files = [...node.files].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {folders.map((folder) => (
        <FolderRow
          key={folder.name}
          folder={folder}
          level={level}
          onOpenFile={onOpenFile}
          onMarkError={onMarkError}
          canMarkErrors={canMarkErrors}
          onDeleteFile={onDeleteFile}
          canEdit={canEdit}
        />
      ))}

      {files.map((file) => (
        <FileRow
          key={file._id}
          file={file}
          level={level}
          onOpenFile={onOpenFile}
          onMarkError={onMarkError}
          canMarkErrors={canMarkErrors}
          onDeleteFile={onDeleteFile}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}

function FolderRow({ folder, level, onOpenFile, onMarkError, canMarkErrors, onDeleteFile, canEdit }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-b border-[var(--color-border)] px-3 py-2.5 text-left text-xs font-heading font-bold text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition"
        style={{ paddingLeft: 12 + level * 20 }}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {open ? (
          <FolderOpen size={18} className="text-[var(--color-accent-deep)]" />
        ) : (
          <Folder size={18} className="text-[var(--color-accent-deep)]" />
        )}
        {folder.name}
      </button>

      {open && (
        <TreeFolder
          node={folder}
          level={level + 1}
          onOpenFile={onOpenFile}
          onMarkError={onMarkError}
          canMarkErrors={canMarkErrors}
          onDeleteFile={onDeleteFile}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}

function FileRow({ file, level, onOpenFile, onMarkError, canMarkErrors, onDeleteFile, canEdit }) {
  return (
    <div
      className="group flex w-full items-center border-b border-[var(--color-border)] hover:bg-[var(--color-accent)]/15 transition"
      style={{ paddingLeft: 32 + level * 20 }}
    >
      <button
        type="button"
        onClick={() => onOpenFile(file)}
        className="flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-2 text-left text-xs text-[var(--color-ink)]"
      >
        <FileText size={16} className="shrink-0 text-[var(--color-ink-muted)]" />
        <span className="min-w-0 flex-1 truncate font-body">{file.name}</span>
        {file.hasError && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-danger)]/15 px-2 py-0.5 text-[10px] font-heading font-bold text-[var(--color-danger)] border border-[var(--color-danger)]/30">
            <AlertTriangle size={11} />
            ERROR
          </span>
        )}
      </button>

      {canMarkErrors && (
        <button
          type="button"
          title={file.hasError ? "Update error" : "Mark error"}
          onClick={() => onMarkError(file)}
          className={`mr-2 rounded-lg p-1.5 transition ${
            file.hasError
              ? "text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              : "text-[var(--color-ink-soft)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
          }`}
        >
          <Flag size={14} />
        </button>
      )}

      {canEdit && onDeleteFile && (
        <button
          type="button"
          title="Delete file"
          onClick={() => onDeleteFile(file._id)}
          className="mr-2 rounded-lg p-1.5 text-[var(--color-ink-soft)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] transition"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}