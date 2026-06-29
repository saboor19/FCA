import SectionCard from "@/components/common/forms/SectionCard";
import TextInput from "@/components/common/forms/TextInput";

export default function LeadContactSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Contact Information"
      description="Primary contact details of the lead."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Primary Phone"
          name="primaryPhone"
          value={formData.primaryPhone}
          onChange={handleChange}
          required
          placeholder="Enter phone number"
        />

        <TextInput
          label="Alternate Phone"
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleChange}
          placeholder="Optional"
        />

        <TextInput
          label="WhatsApp Number"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          placeholder="WhatsApp number"
        />

        <TextInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
        />
      </div>
    </SectionCard>
  );
}
