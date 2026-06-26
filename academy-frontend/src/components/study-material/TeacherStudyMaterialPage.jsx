"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";
import { DataTable } from "@/components/common/table";
import ActionButton from "@/components/common/buttons/ActionButton";
import { useRouter } from "next/navigation";
import studyMaterialService from "@/services/teacher/studyMaterialService";
import { getAssignedBatches } from "@/services/teacher/batchService";

import StudyMaterialFilters from "./StudyMaterialFilters";
import StudyMaterialUploadModal from "./StudyMaterialUploadModal";

export default function TeacherStudyMaterialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [materials, setMaterials] = useState([]);

  const [assignedBatches, setAssignedBatches] = useState([]);

  const [openUploadModal, setOpenUploadModal] =
    useState(false);

  const [filters, setFilters] = useState({

    search: "",

    course: "",

    batch: "",

    subject: "",

    visibility: "",

    sort: "-createdAt",

  });

  // -------------------------------------------------
  // Filter Dropdown Options
  // -------------------------------------------------

  const courseOptions = useMemo(() => {

    const uniqueCourses = new Map();

    assignedBatches.forEach(batch => {

      if (!uniqueCourses.has(batch.course._id)) {

        uniqueCourses.set(batch.course._id, {

          label: batch.course.title,

          value: batch.course._id,

        });

      }

    });

    return [...uniqueCourses.values()];

  }, [assignedBatches]);

  const batchOptions = useMemo(() =>

    assignedBatches.map(batch => ({

      label: batch.name,

      value: batch._id,

    }))

  , [assignedBatches]);

  // -------------------------------------------------

  const columns = [

    {

      key: "title",

      header: "Title",

    },

    {

      key: "subject",

      header: "Subject",

    },

    {

      key: "batch",

      header: "Batch",

      render: (row) => row.batch?.name,

    },

    {

      key: "visibility",

      header: "Visibility",

    },

    {

      key: "actions",

      header: "Actions",

      render: (row) => (

        <div className="flex gap-2">

          <ActionButton
            icon={Eye}
            variant="ghost"
            onClick={() => handleView(row)}
          />

          <ActionButton
            icon={Download}
            variant="secondary"
            onClick={() => handleDownload(row)}
          />

          <ActionButton
            icon={Pencil}
            variant="warning"
            onClick={() => handleEdit(row)}
          />

          <ActionButton
            icon={Trash2}
            variant="danger"
            onClick={() => handleDelete(row)}
          />

        </div>

      ),

    },

  ];

  // -------------------------------------------------
  // Initial Data
  // -------------------------------------------------

  useEffect(() => {

    fetchAssignedBatches();

  }, []);

  useEffect(() => {

    fetchMaterials();

  }, [filters]);

  // -------------------------------------------------

  async function fetchAssignedBatches() {

    try {

      const response =
        await getAssignedBatches();

      setAssignedBatches(response.data || []);

    }

    catch (error) {

      console.error(error);

    }

  }

  async function fetchMaterials() {

    try {

      setLoading(true);

      const response =
        await studyMaterialService.getStudyMaterials(filters);

      setMaterials(response.materials || []);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  // -------------------------------------------------

async function handleUpload(formData) {

  try {

    setLoading(true);

    const response =
      await studyMaterialService.createStudyMaterial(formData);

    console.log(response);

    setOpenUploadModal(false);

    fetchMaterials();

  } catch (error) {

    console.error(error.response?.data || error);

  } finally {

    setLoading(false);

  }

}

  function handleView(row) {

  router.push(

    `/teacher/study-materials/${row._id}`

  );

}

  function handleEdit(row) {}

  function handleDelete(row) {}

  function handleDownload(row) {}

  // -------------------------------------------------

  return (

    <DashboardLayout role="TEACHER">

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">

              Study Materials

            </h1>

            <p className="text-gray-500">

              Upload and manage study materials.

            </p>

          </div>

          <ActionButton
            icon={Plus}
            label="Upload Material"
            onClick={() =>
              setOpenUploadModal(true)
            }
          />

        </div>

        <StudyMaterialFilters

          filters={filters}

          onChange={setFilters}

          onReset={() =>
            setFilters({

              search: "",

              course: "",

              batch: "",

              subject: "",

              visibility: "",

              sort: "-createdAt",

            })
          }

          courses={courseOptions}

          batches={batchOptions}

          subjects={[]}

        />

        <DataTable

          columns={columns}

          data={materials}

          loading={loading}

          emptyTitle="No Study Materials"

          emptyDescription="Upload your first study material."

        />

        <StudyMaterialUploadModal

          isOpen={openUploadModal}

          onClose={() =>
            setOpenUploadModal(false)
          }

          loading={loading}

          courses={assignedBatches}

          batches={assignedBatches}

          subjects={assignedBatches}

          onSubmit={handleUpload}

        />

      </div>

    </DashboardLayout>

  );

}