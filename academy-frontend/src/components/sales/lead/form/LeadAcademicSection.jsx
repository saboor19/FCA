import SectionCard from "@/components/common/forms/SectionCard";
import TextInput from "@/components/common/forms/TextInput";
import NumberInput from "@/components/common/forms/NumberInput";

export default function LeadAcademicSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Academic Information"
      description="Educational and professional background."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextInput
          label="Highest Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="B.Tech, BCA, MCA..."
        />

        <TextInput
          label="Institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="College / University"
        />

        <NumberInput
          label="Passing Year"
          name="passingYear"
          value={formData.passingYear}
          onChange={handleChange}
          placeholder="2025"
        />

        <TextInput
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Student / Employee / Freelancer"
        />

        <NumberInput
          label="Experience (Years)"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="0"
        />
      </div>
    </SectionCard>
  );
}
