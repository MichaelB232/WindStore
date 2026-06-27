import { ShieldAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert";

type DangerAlertProps = {
  title: string;
  description: string;
};

export function DangerAlert({ title, description }: DangerAlertProps) {
  return (
    <Alert className="max-w-md border-red-200 bg-red-50">
      <ShieldAlertIcon className="size-4 text-red-600" />
      <AlertTitle className="text-red-800">{title}</AlertTitle>
      <AlertDescription className="text-red-700">
        {description}
      </AlertDescription>
    </Alert>
  );
}
