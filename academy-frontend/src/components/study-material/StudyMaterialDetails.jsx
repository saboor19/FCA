"use client";

import {
  ArrowLeft,
  Edit,
  Upload,
  Copy,
  Archive,
  Trash2,
  Download,
  Eye,
  BookOpen,
  Layers,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Clock,
} from "lucide-react";

import ActionButton from "@/components/common/buttons/ActionButton";
import StatusBadge from "@/components/common/badges/StatusBadge";

export default function StudyMaterialDetails({
  material,
  role = "TEACHER",

  onBack,
  onEdit,
  onPublish,
  onDuplicate,
  onArchive,
  onDelete,
  onDownload,
  onPreview,
}) {

  if (!material) return null;

  const module =
    material.course?.modules?.find(
      module =>
        module._id === material.moduleId ||
        module._id?.toString() === material.moduleId?.toString()
    );

  return (

    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Study Materials
            </button>

            <h1 className="text-3xl font-bold">

              {material.title}

            </h1>

            {material.summary && (

              <p className="mt-2 max-w-3xl text-gray-500">

                {material.summary}

              </p>

            )}

          </div>

          <StatusBadge
            status={material.status}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      {role === "TEACHER" && (

        <div className="rounded-xl border bg-white p-4 shadow-sm">

          <div className="flex flex-wrap gap-3">

            <ActionButton
              icon={Edit}
              label="Edit"
              onClick={onEdit}
            />

            <ActionButton
              icon={Upload}
              label={
                material.status === "PUBLISHED"
                  ? "Unpublish"
                  : "Publish"
              }
              variant="success"
              onClick={onPublish}
            />

            <ActionButton
              icon={Copy}
              label="Duplicate"
              variant="secondary"
              onClick={onDuplicate}
            />

            <ActionButton
              icon={Archive}
              label="Archive"
              variant="warning"
              onClick={onArchive}
            />

            <ActionButton
              icon={Trash2}
              label="Delete"
              variant="danger"
              onClick={onDelete}
            />

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* OVERVIEW */}
      {/* ================================================= */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold">

            Material Overview

          </h2>

        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            icon={BookOpen}
            label="Course"
            value={material.course?.title}
          />

          <InfoItem
            icon={Users}
            label="Batch"
            value={material.sourceBatch?.name}
          />

          <InfoItem
            icon={Layers}
            label="Module"
            value={module?.title}
          />

          <InfoItem
            icon={FileText}
            label="Type"
            value={material.type}
          />

          <InfoItem
            icon={BarChart3}
            label="Difficulty"
            value={material.difficulty}
          />

          <InfoItem
            icon={Eye}
            label="Visibility"
            value={material.visibility}
          />

          <InfoItem
            icon={Clock}
            label="Read Time"
            value={`${material.estimatedReadTime || 0} mins`}
          />

          <InfoItem
            icon={Calendar}
            label="Created"
            value={
              material.createdAt &&
              new Date(material.createdAt).toLocaleDateString()
            }
          />

          <InfoItem
            label="Version"
            value={material.version}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold">

            Material Content

          </h2>

        </div>

        <div className="space-y-6 p-6">

          <div>

            <h3 className="mb-2 font-semibold">

              Summary

            </h3>

            <p className="text-gray-600">

              {material.summary || "No summary available."}

            </p>

          </div>

          <div>

            <h3 className="mb-2 font-semibold">

              Body

            </h3>

            <div className="rounded-lg bg-gray-50 p-4 whitespace-pre-wrap">

              {material.body || "No content available."}

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* ATTACHMENTS */}
      {/* ================================================= */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold">

            Attachments

          </h2>

        </div>

        <div className="divide-y">

          {material.attachments?.length ? (

            material.attachments.map(file => (

              <div
                key={file._id}
                className="flex items-center justify-between p-5"
              >

                <div>

                  <p className="font-medium">

                    {file.originalName}

                  </p>

                  <p className="text-sm text-gray-500">

                    {file.extension?.toUpperCase()} • {file.size} bytes

                  </p>

                </div>

                <div className="flex gap-2">

                  {file.isPreviewable && (

                    <ActionButton
                      icon={Eye}
                      variant="ghost"
                      onClick={() => onPreview(file)}
                    />

                  )}

                  <ActionButton
                    icon={Download}
                    variant="secondary"
                    onClick={() => onDownload(file)}
                  />

                </div>

              </div>

            ))

          ) : (

            <div className="p-8 text-center text-gray-500">

              No attachments uploaded.

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* SHARED BATCHES */}
      {/* ================================================= */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold">

            Shared Batches

          </h2>

        </div>

        <div className="p-6">

          {material.sharedBatches?.length ? (

            <div className="flex flex-wrap gap-3">

              {material.sharedBatches.map(batch => (

                <span
                  key={batch._id}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
                >
                  {batch.name}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">

              This material is not shared with any other batch.

            </p>

          )}

        </div>

      </div>

    </div>

  );

}

function InfoItem({

  icon: Icon,

  label,

  value,

}) {

  return (

    <div className="flex items-start gap-3">

      {Icon && (

        <Icon className="mt-1 h-5 w-5 text-blue-600" />

      )}

      <div>

        <p className="text-xs uppercase tracking-wide text-gray-500">

          {label}

        </p>

        <p className="font-medium">

          {value || "-"}

        </p>

      </div>

    </div>

  );

}