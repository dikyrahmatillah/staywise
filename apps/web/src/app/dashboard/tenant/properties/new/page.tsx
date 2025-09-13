import { PropertyCreationWizard } from "@/components/tenant/property-creation/property-creation-wizard";

export default function AddNewProperty() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Property</h1>
        <p className="text-gray-600 mt-2">
          Follow the steps below to add a new property to your portfolio.
        </p>
      </div>
      <PropertyCreationWizard />
    </div>
  );
}
