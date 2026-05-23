import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TaskCard } from "./components";
import type { MyTask } from "./myTaskData";
import { toast } from "sonner";
import { PiChatCircleTextBold } from "react-icons/pi";
import {
  useGetMyTasksQuery,
  useUpdateMyTaskStatusMutation,
} from "@/redux/api/myTaskApi";
import { useCreateInitialChatMutation } from "@/redux/slices/chatApi";

export default function MyTask() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10),
  );
  const itemsPerPage = parseInt(searchParams.get("limit") || "4", 10) || 4;
  const navigate = useNavigate();

  const [taskToComplete, setTaskToComplete] = useState<MyTask | null>(null);

  const [createInitialChat] = useCreateInitialChatMutation();
  const { data, isLoading } = useGetMyTasksQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const [updateMyTaskStatus, { isLoading: isUpdating }] =
    useUpdateMyTaskStatusMutation();

  const tasks: MyTask[] = data?.data ?? [];
  const totalItems = data?.meta?.total ?? tasks.length;
  const totalPages = Math.max(
    1,
    data?.meta?.totalPages ?? Math.ceil(totalItems / itemsPerPage),
  );

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    p > 1 ? next.set("page", String(p)) : next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const setLimit = (l: number) => {
    const next = new URLSearchParams(searchParams);
    l !== 4 ? next.set("limit", String(l)) : next.delete("limit");
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setPage(1);
  }, [totalPages, currentPage]);

  const handleConfirmComplete = async () => {
    if (!taskToComplete) return;
    try {
      await updateMyTaskStatus({
        id: taskToComplete.id,
        taskStatus: "COMPLETED",
      }).unwrap();
      toast.success(t("myTask.taskCompleted"));
      setTaskToComplete(null);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update task status";
      toast.error(message);
    }
  };

  const handelChat = async (id: string) => {
    await createInitialChat(id).then((res: any) => {
      if (res?.data?.success) {
        navigate("/communication");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-accent">
          {t("myTask.allTask")}
        </h1>
        <div
          onClick={() =>
            handelChat(tasks?.[0]?.project?.estimates?.userId ?? "")
          }
          className="text-white bg-primary px-4 py-2 rounded-md cursor-pointer flex items-center gap-1"
        >
          <span>
            <PiChatCircleTextBold size={18} />
          </span>
          <span className="text-lg"> Chat </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 rounded-xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={setTaskToComplete}
              isCompleting={isUpdating && taskToComplete?.id === task.id}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        showItemsPerPage
      />

      <ConfirmDialog
        open={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        onConfirm={handleConfirmComplete}
        title={t("myTask.confirmCompleteTitle")}
        description={t("myTask.confirmCompleteDescription")}
        confirmText={t("myTask.complete")}
        cancelText={t("common.cancel")}
        variant="info"
        isLoading={isUpdating}
      />
    </div>
  );
}
