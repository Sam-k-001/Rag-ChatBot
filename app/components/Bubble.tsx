export default function Bubble({ message }: { message: any }) {
  const { content, role } = message;
  return <div className={`bubble ${role}`}>{content}</div>;
}