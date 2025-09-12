import { CategoryManagement } from "@/components/tenant/categories/category-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category Management - StayWise",
  description: "Manage your property categories and classifications",
};

export default async function CategoriesProperty() {
  return (
    <div className="p-6">
      <CategoryManagement />
    </div>
  );
}
