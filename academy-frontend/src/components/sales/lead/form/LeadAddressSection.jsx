import SectionCard from "@/components/common/forms/SectionCard";
import TextareaInput from "@/components/common/forms/TextAreaInput";
import TextInput from "@/components/common/forms/TextInput";

export default function LeadAddressSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Address Information"
      description="Residential location of the lead."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />

        <TextInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />

        <TextInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        <TextInput
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4">
        <TextareaInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street, locality, landmark..."
        />
      </div>
    </SectionCard>
  );
}
