"use client";

import { useState } from "react";
import { X, UploadCloud } from "lucide-react";

export default function FileModal({
  project,
  file,
  onClose,
  onCreated,
  onUpdated,
}) {
  const editing = Boolean(file);

  const [name, setName] =
    useState(file?.name || "");

  const [description, setDescription] =
    useState(file?.description || "");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function uploadFile() {
    if (!selectedFile) {
      throw new Error(
        "Select a file first"
      );
    }

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

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
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
          "Cloudinary upload failed"
      );
    }

    return uploadData;
  }

  async function submit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Enter a file name");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        const res = await fetch(
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
      } else {
        const uploaded =
          await uploadFile();

        const res = await fetch(
          `/api/projects/${project._id}/files`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              description,
              url: uploaded.secure_url,
              publicId:
                uploaded.public_id,
              resourceType:
                uploaded.resource_type,
              format:
                uploaded.format,
              size:
                uploaded.bytes,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              "Could not save file"
          );
        }

        onCreated(data.file);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editing
                ? "Edit File"
                : "Upload File"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Change the file name or description."
                : "Upload a project resource and add its details."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-5"
        >
          {!editing && (
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 p-7 text-center hover:border-blue-400 hover:bg-blue-50/30">
              <UploadCloud
                size={30}
                className="mx-auto text-blue-600"
              />

              <p className="mt-3 font-semibold text-slate-800">
                {selectedFile
                  ? selectedFile.name
                  : "Choose a file"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Documents, images, ZIPs and other project files
              </p>

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </label>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              File name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Project proposal.pdf"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

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
              placeholder="What is this file about?"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            disabled={
              loading ||
              !name.trim() ||
              (!editing &&
                !selectedFile)
            }
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? editing
                ? "Saving..."
                : "Uploading..."
              : editing
              ? "Save Changes"
              : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}