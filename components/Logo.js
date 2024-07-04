import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Logo() {
  return (
    <Link href={"/"} className="flex gap-2">
      <MdAdminPanelSettings style={{ color: "black", fontSize: "4em" }} />
      <span className="text-black mt-6 text-4xl font-mono font-black whitespace-no-wrap truncate">
        Admin
      </span>
    </Link>
  );
}
