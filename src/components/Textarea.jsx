export function Textarea(props) {
  return (
    <textarea
      {...props}
      className="border px-2 py-1 rounded w-full min-h-[80px]"
    />
  );
}