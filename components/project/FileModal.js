"use client";

import { useRef, useState } from "react";
import { X, UploadCloud, FolderOpen } from "lucide-react";

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

  /*
   * ============================================================
   * GET FILES FROM A DROPPED FILE/FOLDER
   * ============================================================
   */

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

      if (!entries.length) {
        break;
      }

      for (const child of entries) {
        const childPath = parentPath
          ? `${parentPath}/${child.name}`
          : child.name;

        if (child.isFile) {
          const file = await getFileFromEntry(child);

          files.push({
            file,
            relativePath: childPath,
          });
        } else if (child.isDirectory) {
          const nestedFiles = await readDirectory(
            child,
            childPath
          );

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

      const entry =
        item.webkitGetAsEntry?.();

      if (!entry) {
        const file = item.getAsFile();

        if (file) {
          results.push({
            file,
            relativePath: file.name,
          });
        }

        continue;
      }

      if (entry.isFile) {
        const file =
          await getFileFromEntry(entry);

        results.push({
          file,
          relativePath: file.name,
        });
      }

      if (entry.isDirectory) {
        const folderFiles =
          await readDirectory(
            entry,
            entry.name
          );

        results.push(...folderFiles);
      }
    }

    return results;
  }

  /*
   * ============================================================
   * NORMAL FILE SELECTION
   * ============================================================
   */

  function handleFilesSelected(event) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    const formattedFiles = files.map(
      (file) => ({
        file,
        relativePath:
          file.webkitRelativePath ||
          file.name,
      })
    );

    setSelectedFiles(formattedFiles);

    /*
     * Automatically use the first file's name
     * when uploading a normal single file.
     */
    if (formattedFiles.length === 1) {
      setName(
        formattedFiles[0].file.name
      );
    }
  }

  /*
   * ============================================================
   * FOLDER SELECTION
   * ============================================================
   */

  function handleFolderSelected(event) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    const formattedFiles = files.map(
      (file) => ({
        file,
        relativePath:
          file.webkitRelativePath ||
          file.name,
      })
    );

    setSelectedFiles(formattedFiles);

    /*
     * For folders, use the folder name as
     * the display name.
     */
    const firstPath =
      formattedFiles[0]?.relativePath;

    if (firstPath) {
      const folderName =
        firstPath.split("/")[0];

      setName(folderName);
    }
  }

  /*
   * ============================================================
   * DRAG & DROP
   * ============================================================
   */

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
      const files =
        await getDroppedFiles(
          event.dataTransfer
        );

      if (!files.length) {
        alert(
          "No files were found in the dropped item."
        );

        return;
      }

      setSelectedFiles(files);

      /*
       * If one file was dropped,
       * use its name.
       */
      if (files.length === 1) {
        setName(files[0].file.name);
      } else {
        /*
         * If multiple files were dropped,
         * show a useful name.
         */
        setName(
          `${files.length} files`
        );
      }
    } catch (error) {
      console.error(
        "DROP ERROR:",
        error
      );

      alert(
        "Could not read the dropped files/folder."
      );
    }
  }

  /*
   * ============================================================
   * CLOUDINARY UPLOAD
   * ============================================================
   */

  async function uploadSingleFile(
    selected
  ) {
    const {
      file,
      relativePath,
    } = selected;

    /*
     * Ask our backend for a Cloudinary signature.
     */
    const signRes = await fetch(
      `/api/projects/${project._id}/files/sign`,
      {
        method: "POST",
      }
    );

    const signData =
      await signRes.json();

    if (!signRes.ok) {
      throw new Error(
        signData.error ||
          "Could not prepare upload"
      );
    }

    /*
     * Cloudinary upload.
     */
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "api_key",
      signData.apiKey
    );

    formData.append(
      "timestamp",
      signData.timestamp
    );

    formData.append(
      "signature",
      signData.signature
    );

    formData.append(
      "folder",
      signData.folder
    );

    const uploadRes =
      await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const uploadData =
      await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(
        uploadData.error?.message ||
          `Cloudinary upload failed for ${file.name}`
      );
    }

    /*
     * Save metadata in MongoDB.
     */
    const saveRes =
      await fetch(
        `/api/projects/${project._id}/files`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name:
              relativePath ||
              file.name,

            originalName:
              file.name,

            description,

            url:
              uploadData.secure_url,

            publicId:
              uploadData.public_id,

            resourceType:
              uploadData.resource_type,

            format:
              uploadData.format || "",

            size:
              uploadData.bytes || file.size,

            mimeType:
              file.type ||
              "application/octet-stream",

            extension:
              file.name.includes(".")
                ? file.name
                    .split(".")
                    .pop()
                : "",

            editable: false,
          }),
        }
      );

    const saveData =
      await saveRes.json();

    if (!saveRes.ok) {
      throw new Error(
        saveData.error ||
          `Could not save ${file.name}`
      );
    }

    return saveData.file;
  }

  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  async function submit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert(
        "Enter a file name"
      );

      return;
    }

    /*
     * EDIT MODE
     */
    if (editing) {
      setLoading(true);

      try {
        const res =
          await fetch(
            `/api/projects/${project._id}/files/${file._id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                description,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              "Could not update file"
          );
        }

        onUpdated(data.file);
      } catch (error) {
        alert(
          error.message
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    /*
     * UPLOAD MODE
     */

    if (!selectedFiles.length) {
      alert(
        "Select a file or folder first."
      );

      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];

      for (
        let i = 0;
        i < selectedFiles.length;
        i++
      ) {
        const uploaded =
          await uploadSingleFile(
            selectedFiles[i]
          );

        uploadedFiles.push(
          uploaded
        );

        const progress =
          Math.round(
            ((i + 1) /
              selectedFiles.length) *
              100
          );

        setUploadProgress(
          progress
        );
      }

      /*
       * Tell parent about uploaded files.
       *
       * If your existing parent expects one file,
       * send the first one.
       *
       * If multiple files were uploaded,
       * send the whole array as well.
       */
      if (
        uploadedFiles.length === 1
      ) {
        onCreated(
          uploadedFiles[0]
        );
      } else {
        uploadedFiles.forEach(
          (uploaded) =>
            onCreated(uploaded)
        );
      }

      /*
       * Done.
       */
      onClose();
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      alert(
        error.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onDragOver={(e) => {
        /*
         * VERY IMPORTANT:
         *
         * Prevent the browser from navigating to
         * the dropped folder.
         */
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editing
                ? "Edit File"
                : "Upload Files"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Change the file name or description."
                : "Upload files or an entire folder to your project."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-5"
        >
          {!editing && (
            <>
              {/* DROP AREA */}

              <div
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
                  dragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
              >
                <UploadCloud
                  size={34}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  {dragging
                    ? "Drop files or folder here"
                    : selectedFiles.length
                      ? `${selectedFiles.length} file${
                          selectedFiles.length ===
                          1
                            ? ""
                            : "s"
                        } selected`
                      : "Drag & drop files or a folder"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Or choose files/folder manually
                </p>

                {/* BUTTONS */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {/* FILE INPUT */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      inputRef.current?.click()
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Choose Files
                  </button>

                  {/* FOLDER INPUT */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      folderInputRef.current?.click()
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FolderOpen
                      size={17}
                    />

                    Choose Folder
                  </button>
                </div>

                {/* NORMAL FILE INPUT */}

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={
                    handleFilesSelected
                  }
                />

                {/* FOLDER INPUT */}

                <input
                  ref={folderInputRef}
                  type="file"
                  multiple
                  webkitdirectory=""
                  directory=""
                  className="hidden"
                  onChange={
                    handleFolderSelected
                  }
                />
              </div>

              {/* SELECTED FILES */}

              {selectedFiles.length >
                0 && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Selected
                  </p>

                  <div className="space-y-1">
                    {selectedFiles
                      .slice(0, 50)
                      .map(
                        (
                          selected,
                          index
                        ) => (
                          <div
                            key={`${selected.relativePath}-${index}`}
                            className="truncate rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                            title={
                              selected.relativePath
                            }
                          >
                            📄{" "}
                            {
                              selected.relativePath
                            }
                          </div>
                        )
                      )}

                    {selectedFiles.length >
                      50 && (
                      <p className="px-3 py-1 text-xs text-slate-400">
                        +
                        {selectedFiles.length -
                          50}{" "}
                        more files
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* FILE NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {selectedFiles.length >
                1
                ? "Upload name"
                : "File name"}
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={loading}
              placeholder="Project proposal.pdf"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={loading}
              placeholder="What is this file about?"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          {/* PROGRESS */}

          {loading &&
            !editing && (
              <div>
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                  <span>
                    Uploading...
                  </span>

                  <span>
                    {
                      uploadProgress
                    }
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              loading ||
              !name.trim() ||
              (!editing &&
                !selectedFiles.length)
            }
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? editing
                ? "Saving..."
                : `Uploading ${uploadProgress}%...`
              : editing
                ? "Save Changes"
                : selectedFiles.length >
                    1
                  ? `Upload ${selectedFiles.length} Files`
                  : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}