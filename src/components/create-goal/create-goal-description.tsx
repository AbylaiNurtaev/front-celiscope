import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Block } from "../ui/block";
import { useEffect, useMemo, useState } from "react";
import { aiService } from "@/services/ai.service";

export function CreateGoalDescription({
  register,
  watch,
  setValue,
}: {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const smartFilled = useMemo(() => {
    const required = [
      watch("title"),
      watch("specific"),
      watch("measurable"),
      watch("attainable"),
      watch("relevant"),
    ];
    return required.every((v) => typeof v === "string" && v.trim().length > 0);
  }, [
    watch("title"),
    watch("specific"),
    watch("measurable"),
    watch("attainable"),
    watch("relevant"),
  ]);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const title = watch("title") as string;
      const contextParts = [
        watch("specific"),
        watch("measurable"),
        watch("attainable"),
        watch("relevant"),
        watch("award") ? `Награда: ${watch("award")}` : undefined,
      ].filter(Boolean);
      const context = contextParts.join("\n");
      const text = await aiService.generateGoalDescription({ title, context });
      console.log("[AI] /ai/goal/description <- response:", { text });
      setValue("description", text, { shouldDirty: true });
    } catch (e) {
      // Ошибка покажется через axios interceptor/toast
    } finally {
      setIsLoading(false);
    }
  };

  // Автогенерация при заполненных SMART полях (с дебаунсом)
  useEffect(() => {
    if (!smartFilled) return;
    const t = setTimeout(() => {
      handleGenerate();
    }, 600);
    return () => clearTimeout(t);
  }, [
    smartFilled,
    watch("title"),
    watch("specific"),
    watch("measurable"),
    watch("attainable"),
    watch("relevant"),
    watch("award"),
  ]);

  return (
    <Block title="Полное описание цели:">
      <div className="w-full px-4">
        <textarea
          {...register("description")}
          required
          readOnly
          className="border-b-1 border-[#2F51A8] w-full h-40 outline-none resize-none bg-gray-50"
        />
        {isLoading && (
          <div className="flex justify-end mt-3 text-sm text-gray-500">
            Генерация...
          </div>
        )}
      </div>
    </Block>
  );
}