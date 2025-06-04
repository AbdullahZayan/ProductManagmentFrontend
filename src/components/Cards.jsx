export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>;
}
export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-gray-500">{children}</p>;
export const CardContent = ({ children }) => <div className="space-y-4">{children}</div>;
export const CardFooter = ({ children }) => <div className="mt-4">{children}</div>;