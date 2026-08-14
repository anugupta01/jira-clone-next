import Link from "next/link";
export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <Link href="/project/board" className="text-blue-600">Go to board</Link>
    </div>
  );
}
