import SectionCard from "@/components/common/forms/SectionCard";
import SelectInput from "@/components/common/forms/SelectInput";
import NumberInput from "@/components/common/forms/NumberInput";
import TextareaInput from "@/components/common/forms/TextAreaInput";
import { LEAD_PRIORITY } from "@/constants/salesConstants";

export default function LeadPipelineSection({ formData, handleChange }) {
  return (
    <SectionCard
      title="Lead Priority"
      description="Internal evaluation of this enquiry."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={LEAD_PRIORITY.map((priority) => ({
            value: priority,
            label: priority,
          }))}
        />

        <NumberInput
          label="Lead Score"
          name="leadScore"
          value={formData.leadScore}
          onChange={handleChange}
          min={0}
          max={100}
        />
      </div>

      <div className="mt-4">
        <TextareaInput
          label="Initial Remarks"
          name="initialRemarks"
          value={formData.initialRemarks}
          onChange={handleChange}
          rows={4}
          placeholder="Any important discussion with the lead..."
        />
      </div>
    </SectionCard>
  );
}
