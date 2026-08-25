"use client";

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  AlertTriangle,
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
}) {
  const tree = useMemo(
    () => buildTree(files),
    [files]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <TreeFolder
        node={tree}
        level={0}
        onOpenFile={onOpenFile}
      />
    </div>
  );
}

function TreeFolder({
  node,
  level,
  onOpenFile,
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
        />
      ))}
    </div>
  );
}

function FolderRow({
  folder,
  level,
  onOpenFile,
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
        />
      )}
    </div>
  );
}

function FileRow({
  file,
  level,
  onOpenFile,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onOpenFile(file)
      }
      className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-blue-50"
      style={{
        paddingLeft:
          32 + level * 20,
      }}
    >
      <FileText
        size={17}
        className="shrink-0 text-slate-400"
      />

      <span className="min-w-0 flex-1 truncate">
        {file.name}
      </span>

      {file.hasError && (
        <AlertTriangle
          size={16}
          className="shrink-0 text-red-500"
        />
      )}
    </button>
  );
}