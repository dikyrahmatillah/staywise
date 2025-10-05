import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface CompletionCheck {
  label: string;
  completed: boolean;
  details: string;
}

interface CompletionStatusProps {
  completionChecks: CompletionCheck[];
  allCompleted: boolean;
}

export const CompletionStatus = ({
  completionChecks,
  allCompleted,
}: CompletionStatusProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionChecks.map((check, index) => (
              <div key={index} className="flex items-start gap-3">
                {check.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.label}</span>
                    <Badge variant={check.completed ? "default" : "secondary"}>
                      {check.completed ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{check.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
