import {
  Settings,
  MapPin,
  Users,
  Monitor,
  DoorOpen
}
from "lucide-react";

export default function BatchSettingsCard({
  batch,
  onEdit
}){

  return (

    <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-lg font-semibold flex items-center gap-2">

            <Settings size={18} />

            Batch Settings

          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Manage batch configuration.
          </p>

        </div>

        <button
          onClick={onEdit}
          className="px-4 py-2 rounded-xl border border-border-custom hover:bg-accent transition"
        >
          Edit Batch
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="rounded-xl border p-4">

          <div className="flex items-center gap-2 mb-2">

            <Monitor size={16} />

            <span className="text-sm font-medium">
              Study Mode
            </span>

          </div>

          <p className="text-sm text-muted-foreground">

            {batch.studyMode}

          </p>

        </div>

        <div className="rounded-xl border p-4">

          <div className="flex items-center gap-2 mb-2">

            <Users size={16} />

            <span className="text-sm font-medium">
              Capacity
            </span>

          </div>

          <p className="text-sm text-muted-foreground">

            {batch.capacity}

          </p>

        </div>

        <div className="rounded-xl border p-4">

          <div className="flex items-center gap-2 mb-2">

            <DoorOpen size={16} />

            <span className="text-sm font-medium">
              Room
            </span>

          </div>

          <p className="text-sm text-muted-foreground">

            {batch.roomNumber || "N/A"}

          </p>

        </div>

        <div className="rounded-xl border p-4">

          <div className="flex items-center gap-2 mb-2">

            <MapPin size={16} />

            <span className="text-sm font-medium">
              Radius
            </span>

          </div>

          <p className="text-sm text-muted-foreground">

            {batch.attendanceConfig?.radius || 0}m

          </p>

        </div>

      </div>

    </div>

  );

}