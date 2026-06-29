"use client";

import { useEffect, useState } from "react";
import SectionCard from "@/components/common/forms/SectionCard";
import SelectInput from "@/components/common/forms/SelectInput";
import TextInput from "@/components/common/forms/TextInput";
import NumberInput from "@/components/common/forms/NumberInput";
import DateInput from "@/components/common/forms/DateInput";
import { STUDY_MODE, TIMING } from "@/constants/salesConstants";
import { getAllCourses as getCourses } from "@/services/public/courseService";
import { getBatches } from "@/services/admin/batchService";

export default function LeadCourseSection({ formData, handleChange }) {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!formData.interestedCourse) {
      setBatches([]);
      return;
    }
    fetchBatches();
  }, [formData.interestedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await getBatches({
        course: formData.interestedCourse,
      });
      setBatches(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SectionCard
      title="Course Interest"
      description="Preferred course and admission preferences."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectInput
          label="Interested Course"
          name="interestedCourse"
          required
          value={formData.interestedCourse}
          onChange={handleChange}
          options={courses.map((course) => ({
            value: course._id,
            label: course.title,
          }))}
        />

        <SelectInput
          label="Preferred Batch"
          name="preferredBatch"
          value={formData.preferredBatch}
          onChange={handleChange}
          options={batches.map((batch) => ({
            value: batch._id,
            label: batch.name,
          }))}
        />

        <SelectInput
          label="Study Mode"
          name="studyMode"
          value={formData.studyMode}
          onChange={handleChange}
          options={STUDY_MODE.map((mode) => ({
            value: mode,
            label: mode,
          }))}
        />

        <SelectInput
          label="Preferred Timing"
          name="preferredTiming"
          value={formData.preferredTiming}
          onChange={handleChange}
          options={TIMING.map((mode) => ({
            value: mode,
            label: mode,
          }))}
        />

        <DateInput
          label="Expected Joining Date"
          name="expectedJoiningDate"
          value={formData.expectedJoiningDate}
          onChange={handleChange}
        />

        <NumberInput
          label="Budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="5000"
        />
      </div>
    </SectionCard>
  );
}
