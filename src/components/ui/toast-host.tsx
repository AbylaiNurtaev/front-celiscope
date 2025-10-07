import { useEffect, useState } from "react";
import { notify } from "@/lib/notify";

type Toast = { id: number; text: string };

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // const unsub = notify.subscribe((text) => {
    //   const id = Date.now();
    //   setToasts((prev) => [...prev, { id, text }]);
    //   setTimeout(() => {
    //     setToasts((prev) => prev.filter((t) => t.id !== id));
    //   }, 3500);
    // });
    // return () => unsub();
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-[1000] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200 text-gray-900 w-full max-w-md"
        >
          <div className="font-semibold text-blue-600 mb-1">Целескоп ИИ</div>
          <div>{t.text}</div>
        </div>
      ))}
    </div>
  );
}
