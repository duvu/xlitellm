import { cx } from "@/lib/cva.config";
import { UiLoadingSpinner } from "../ui/ui-loading-spinner";

export default function LoadingScreen() {
  return (
    <div className={cx("h-screen", "flex items-center justify-center")}>
      <UiLoadingSpinner className="size-5 text-gray-500" />
    </div>
  );
}
