import SectionCard from "@/components/common/forms/SectionCard";
import TextInput from "@/components/common/forms/TextInput";
import SelectInput from "@/components/common/forms/SelectInput";
import { LEAD_SOURCE } from "@/constants/salesConstants";

export default function LeadMarketingSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Marketing Information"
      description="Capture where this enquiry originated."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectInput
          label="Lead Source"
          name="source"
          required
          value={formData.source}
          onChange={handleChange}
          options={LEAD_SOURCE.map((source) => ({
            value: source,
            label: source.replaceAll("_", " "),
          }))}
        />

        <TextInput
          label="Sub Source"
          name="subSource"
          value={formData.subSource}
          onChange={handleChange}
          placeholder="Instagram Story"
        />

        <TextInput
          label="Campaign"
          name="campaign"
          value={formData.campaign}
          onChange={handleChange}
          placeholder="Summer AI Bootcamp"
        />

        <TextInput
          label="Referred By"
          name="referredBy"
          value={formData.referredBy}
          onChange={handleChange}
          placeholder="Friend / Alumni"
        />
      </div>
    </SectionCard>
  );
}
