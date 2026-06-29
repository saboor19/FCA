import SectionCard from "@/components/common/forms/SectionCard";
import TextInput from "@/components/common/forms/TextInput";
import SelectInput from "@/components/common/forms/SelectInput";
import DateInput from "@/components/common/forms/DateInput";
import { GENDER } from "@/constants/salesConstants";

export default function LeadPersonalSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Personal Information"
      description="Basic information about the lead."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TextInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="John"
        />

        <TextInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
        />

        <SelectInput
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={GENDER.map((gender) => ({
            label: gender,
            value: gender,
          }))}
        />

        <DateInput
          label="Date of Birth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
    </SectionCard>
  );
}
