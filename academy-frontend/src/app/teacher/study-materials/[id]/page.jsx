"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import StudyMaterialDetails from "@/components/study-material/StudyMaterialDetails";

import studyMaterialService from "@/services/teacher/studyMaterialService";

export default function TeacherStudyMaterialDetailsPage() {

  const router = useRouter();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [material, setMaterial] = useState(null);

  useEffect(() => {

    if (id) {

      fetchMaterial();

    }

  }, [id]);

  async function fetchMaterial() {

    try {

      setLoading(true);

      const response =
        await studyMaterialService.getStudyMaterial(id);

      setMaterial(response.material);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  // =====================================================
  // ACTIONS
  // =====================================================

  function handleBack() {

    router.push("/teacher/study-materials");

  }

  function handleEdit() {

    router.push(

      `/teacher/study-materials/${id}/edit`

    );

  }

  async function handlePublish() {

    console.log("Publish");

  }

  async function handleDuplicate() {

    console.log("Duplicate");

  }

  async function handleArchive() {

    console.log("Archive");

  }

  async function handleDelete() {

    console.log("Delete");

  }

  async function handlePreview(file) {

    console.log(file);

  }

  async function handleDownload(file) {

    console.log(file);

  }

  // =====================================================

  return (

    <DashboardLayout role="TEACHER">

      {loading ? (

        <div className="rounded-xl bg-white p-10 text-center">

          Loading study material...

        </div>

      ) : !material ? (

        <div className="rounded-xl bg-white p-10 text-center">

          Study Material not found.

        </div>

      ) : (

        <StudyMaterialDetails

          material={material}

          role="TEACHER"

          onBack={handleBack}

          onEdit={handleEdit}

          onPublish={handlePublish}

          onDuplicate={handleDuplicate}

          onArchive={handleArchive}

          onDelete={handleDelete}

          onPreview={handlePreview}

          onDownload={handleDownload}

        />

      )}

    </DashboardLayout>

  );

}