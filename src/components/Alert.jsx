import { AlertCircle } from "lucide-react";
export function Alert({ children, className = "" }) {
  return (
    <div className={`flex items-start gap-2 p-3 border border-red-300 bg-red-100 rounded ${className}`}>
      <AlertCircle className="h-4 w-4 text-red-600 mt-1" />
      <div>{children}</div>
    </div>
  );
}

export const AlertDescription = ({ children }) => (
  <p className="text-sm text-red-600">{children}</p>
);