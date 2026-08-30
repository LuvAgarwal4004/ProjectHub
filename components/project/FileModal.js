"use client";

import { useRef, useState } from "react";
import { X, UploadCloud, FolderOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FileModal({
  project,
  file,
  onClose,
  onCreated,
  onUpdated,
}) {
  const editing = Boolean(file);

  const inputRef = useRef(null);
  const folderInputRef = useRef(null);

  const [name, setName] = useState(file?.name || "");
  const [description, setDescription] = useState(
    file?.description || ""
  );

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function isEditableFile(file) {
    const editableExtensions = [
      "js", "jsx", "ts", "tsx", "css", "scss", "html", "json", "md",
      "txt", "xml", "yml", "yaml", "py", "java", "c", "cpp", "h",
      "hpp", "cs", "php", "sql", "sh", "bash", "env",
    ];

    const extension = file.name?.split(".").pop()?.toLowerCase();
    return editableExtensions.includes(extension);
  }

  async function readDirectory(entry, parentPath = "") {
    const files = [];
    const reader = entry.createReader();

    async function readEntries() {
      return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
    }

    while (true) {
      const entries = await readEntries();
      if (!entries.length) break;

      for (const child of entries) {
        const childPath = parentPath ? `${parentPath}/${child.name}` : child.name;

        if (child.isFile) {
          const file = await getFileFromEntry(child);
          files.push({ file, relativePath: childPath });
        } else if (child.isDirectory) {
          const nestedFiles = await readDirectory(child, childPath);
          files.push(...nestedFiles);
        }
      }
    }

    return files;
  }

  function getFileFromEntry(entry) {
    return new Promise((resolve, reject) => {
      entry.file(resolve, reject);
    });
  }

  async function getDroppedFiles(dataTransfer) {
    const items = Array.from(dataTransfer.items || []);
    const results = [];

    for (const item of items) {
      if (item.kind !== "file") continue;
      const entry = item.webkitGetAsEntry?.();

      if (!entry) {
        const file = item.getAsFile();
        if (file) {
          results.push({ file, relativePath: file.name });
        }
        continue;
      }

      if (entry.isFile) {
        const file = await getFileFromEntry(entry);
        results.push({ file, relativePath: file.name });
      }

      if (entry.isDirectory) {
        const folderFiles = await readDirectory(entry, entry.name);
        results.push(...folderFiles);
      }
    }

    return results;
  }

  function handleFilesSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formattedFiles = files.map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }));

    setSelectedFiles(formattedFiles);

    if (formattedFiles.length === 1) {
      setName(formattedFiles[0].file.name);
    }
  }

  function handleFolderSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formattedFiles = files.map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }));

    setSelectedFiles(formattedFiles);

    const firstPath = formattedFiles[0]?.relativePath;
    if (firstPath) {
      const folderName = firstPath.split("/")[0];
      setName(folderName);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  }

  async function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    try {
      const files = await getDroppedFiles(event.dataTransfer);
      if (!files.length) {
        alert("No files were found in the dropped item.");
        return;
      }

      setSelectedFiles(files);

      if (files.length === 1) {
        setName(files[0].file.name);
      } else {
        setName(`${files.length} files`);
      }
    } catch (error) {
      console.error("DROP ERROR:", error);
      alert("Could not read the dropped files/folder.");
    }
  }

  async function uploadSingleFile(selected) {
    const { file, relativePath } = selected;

    const signRes = await fetch(`/api/projects/${project._id}/files/sign`, {
      method: "POST",
    });

    const signData = await signRes.json();
    if (!signRes.ok) {
      throw new Error(signData.error || "Could not prepare upload");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(
        uploadData.error?.message || `Cloudinary upload failed for ${file.name}`
      );
    }

    const saveRes = await fetch(`/api/projects/${project._id}/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: relativePath || file.name,
        originalName: file.name,
        description,
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
        resourceType: uploadData.resource_type,
        format: uploadData.format || "",
        size: uploadData.bytes || file.size,
        mimeType: file.type || "application/octet-stream",
        extension: file.name.includes(".") ? file.name.split(".").pop() : "",
        editable: isEditableFile(file),
      }),
    });

    const saveData = await saveRes.json();
    if (!saveRes.ok) {
      throw new Error(saveData.error || `Could not save ${file.name}`);
    }

    return saveData.file;
  }

  async function submit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Enter a file name");
      return;
    }

    if (editing) {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/projects/${project._id}/files/${file._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              description,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Could not update file");
        }

        onUpdated(data.file);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!selectedFiles.length) {
      alert("Select a file or folder first.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const uploaded = await uploadSingleFile(selectedFiles[i]);
        uploadedFiles.push(uploaded);
        const progress = Math.round(((i + 1) / selectedFiles.length) * 100);
        setUploadProgress(progress);
      }

      if (uploadedFiles.length === 1) {
        onCreated(uploadedFiles[0]);
      } else {
        uploadedFiles.forEach((uploaded) => onCreated(uploaded));
      }

      onClose();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-body"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-xl rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl sm:p-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold uppercase text-[var(--color-ink)]">
              {editing ? "Edit File" : "Upload Files"}
            </h2>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {editing
                ? "Change the file name or description."
                : "Upload files or an entire folder to your project."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          {!editing && (
            <>
              {/* DROP AREA */}
              <div
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-[12px] border-2 border-dashed p-8 text-center transition ${
                  dragging
                    ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/15"
                    : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent-deep)]"
                }`}
              >
                <UploadCloud
                  size={36}
                  className="mx-auto text-[var(--color-accent-deep)]"
                />

                <p className="mt-3 font-heading font-bold text-sm text-[var(--color-ink)]">
                  {dragging
                    ? "Drop files or folder here"
                    : selectedFiles.length
                    ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`
                    : "Drag & drop files or a folder"}
                </p>

                <p className="mt-1 text-xs text-[var(--color-ink-muted)] font-body">
                  Or choose files/folder manually
                </p>

                {/* BUTTONS */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => inputRef.current?.click()}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-xs font-heading font-bold text-[var(--color-ink)] shadow-2xs hover:bg-[var(--color-surface-muted)] transition disabled:opacity-50"
                  >
                    Choose Files
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => folderInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-xs font-heading font-bold text-[#0B0B0A] hover:bg-[var(--color-accent-hover)] transition disabled:opacity-50"
                  >
                    <FolderOpen size={16} />
                    Choose Folder
                  </button>
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                />

                <input
                  ref={folderInputRef}
                  type="file"
                  multiple
                  webkitdirectory=""
                  directory=""
                  className="hidden"
                  onChange={handleFolderSelected}
                />
              </div>

              {/* SELECTED FILES PREVIEW */}
              {selectedFiles.length > 0 && (
                <div className="max-h-36 overflow-y-auto rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                  <p className="mb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                    Selected Files ({selectedFiles.length})
                  </p>
                  <div className="space-y-1">
                    {selectedFiles.slice(0, 50).map((selected, index) => (
                      <div
                        key={`${selected.relativePath}-${index}`}
                        className="truncate rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-body text-[var(--color-ink)] flex items-center gap-1.5"
                        title={selected.relativePath}
                      >
                        <FileText size={13} className="text-[var(--color-ink-muted)] shrink-0" />
                        <span className="truncate">{selected.relativePath}</span>
                      </div>
                    ))}
                    {selectedFiles.length > 50 && (
                      <p className="px-3 py-1 text-xs text-[var(--color-ink-muted)] font-body">
                        +{selectedFiles.length - 50} more files
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* FILE NAME INPUT */}
          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              {selectedFiles.length > 1 ? "Upload Name" : "File Name"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Project proposal.pdf"
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
            />
          </div>

          {/* DESCRIPTION TEXTAREA */}
          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="What is this file about?"
              rows={3}
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
            />
          </div>

          {/* PROGRESS */}
          {loading && !editing && (
            <div>
              <div className="mb-1.5 flex justify-between text-xs font-heading font-bold text-[var(--color-accent-deep)]">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent-deep)] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={
              loading ||
              !name.trim() ||
              (!editing && !selectedFiles.length)
            }
          >
            {loading
              ? editing
                ? "Saving..."
                : `Uploading ${uploadProgress}%...`
              : editing
              ? "Save Changes"
              : selectedFiles.length > 1
              ? `Upload ${selectedFiles.length} Files`
              : "Upload File"}
          </Button>
        </form>
      </div>
    </div>
  );
}