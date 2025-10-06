import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface CompletionStatusProps {
  allCompleted: boolean;
}

export const CompletionStatus = ({ allCompleted }: CompletionStatusProps) => {
  return (
    <>
      {!allCompleted && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Almost Ready!</p>
                <p className="text-orange-800 text-sm mt-1">
                  Please complete all sections before creating your property.
                  You can go back to previous steps using the navigation above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
