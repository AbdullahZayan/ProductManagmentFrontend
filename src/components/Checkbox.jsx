export default function Checkbox({ id, checked, onChange }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="form-checkbox h-4 w-4 text-blue-600"
    />
  );
}