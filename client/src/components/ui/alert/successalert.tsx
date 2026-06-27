import { CheckCircle2Icon } from "lucide-react";

type SuccesAlertProps = {
  title: string;
  description: string;
};

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/ui/shadcn/alert";

export function SuccessAlert({ title, description }: SuccesAlertProps) {
  return (
    <Alert className="max-w-md border-green-200 bg-green-50">
      <CheckCircle2Icon className="size-4 text-green-600" />
      <AlertTitle className="text-green-800">{title}</AlertTitle>
      <AlertDescription className="text-green-700">
        {description}
      </AlertDescription>
    </Alert>
  );
}
