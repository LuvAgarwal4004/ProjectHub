"use client";

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  AlertTriangle,
  Flag,
} from "lucide-react";

import { useMemo, useState } from "react";

function buildTree(files) {
  const root = {
    type: "folder",
    name: "",
    children: {},
    files: [],
  };

  for (const file of files) {
    const path =
      file.path ||
      file.name;

    const parts =
      path
        .split("/")
        .filter(Boolean);

    let current = root;

    parts.forEach(
      (part, index) => {
        const isFile =
          index ===
          parts.length - 1;

        if (isFile) {
          current.files.push(
            file
          );

          return;
        }

        if (
          !current.children[
            part
          ]
        ) {
          current.children[
            part
          ] = {
            type: "folder",
            name: part,
            children: {},
            files: [],
          };
        }

        current =
          current.children[
            part
          ];
      }
    );
  }

  return root;
}

export default function FileTree({
  files,
  onOpenFile,
  onMarkError,
  canMarkErrors,
}) {
  const tree = useMemo(
    () => buildTree(files),
    [files]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <TreeFolder
        node={tree}
        level={0}
        onOpenFile={onOpenFile}
        onMarkError={onMarkError}
        canMarkErrors={
          canMarkErrors
        }
      />
    </div>
  );
}

function TreeFolder({
  node,
  level,
  onOpenFile,
  onMarkError,
  canMarkErrors,
}) {
  const folders =
    Object.values(
      node.children
    ).sort((a, b) =>
      a.name.localeCompare(
        b.name
      )
    );

  const files =
    [...node.files].sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    );

  return (
    <div>
      {folders.map(
        (folder) => (
          <FolderRow
            key={folder.name}
            folder={folder}
            level={level}
            onOpenFile={
              onOpenFile
            }
            onMarkError={
              onMarkError
            }
            canMarkErrors={
              canMarkErrors
            }
          />
        )
      )}

      {files.map((file) => (
        <FileRow
          key={file._id}
          file={file}
          level={level}
          onOpenFile={
            onOpenFile
          }
          onMarkError={
            onMarkError
          }
          canMarkErrors={
            canMarkErrors
          }
        />
      ))}
    </div>
  );
}

function FolderRow({
  folder,
  level,
  onOpenFile,
  onMarkError,
  canMarkErrors,
}) {
  const [open, setOpen] =
    useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setOpen((v) => !v)
        }
        className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
        style={{
          paddingLeft:
            12 + level * 20,
        }}
      >
        {open ? (
          <ChevronDown
            size={16}
          />
        ) : (
          <ChevronRight
            size={16}
          />
        )}

        {open ? (
          <FolderOpen
            size={18}
            className="text-blue-500"
          />
        ) : (
          <Folder
            size={18}
            className="text-blue-500"
          />
        )}

        {folder.name}
      </button>

      {open && (
        <TreeFolder
          node={folder}
          level={level + 1}
          onOpenFile={
            onOpenFile
          }
          onMarkError={
            onMarkError
          }
          canMarkErrors={
            canMarkErrors
          }
        />
      )}
    </div>
  );
}

function FileRow({
  file,
  level,
  onOpenFile,
  onMarkError,
  canMarkErrors,
}) {
  return (
    <div
      className="group flex w-full items-center border-b border-slate-100 hover:bg-blue-50"
      style={{
        paddingLeft:
          32 + level * 20,
      }}
    >
      {/* FILE */}

      <button
        type="button"
        onClick={() =>
          onOpenFile(file)
        }
        className="flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-2 text-left text-sm text-slate-600"
      >
        <FileText
          size={17}
          className="shrink-0 text-slate-400"
        />

        <span className="min-w-0 flex-1 truncate">
          {file.name}
        </span>

        {file.hasError && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
            <AlertTriangle
              size={11}
            />
            ERROR
          </span>
        )}
      </button>

      {/* MARK ERROR */}

      {canMarkErrors && (
        <button
          type="button"
          title={
            file.hasError
              ? "Update error"
              : "Mark error"
          }
          onClick={() =>
            onMarkError(file)
          }
          className={`mr-2 rounded-lg p-2 transition ${
            file.hasError
              ? "text-red-600 hover:bg-red-100"
              : "text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
          }`}
        >
          <Flag
            size={15}
          />
        </button>
      )}
    </div>
  );
}