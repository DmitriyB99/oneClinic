import { useTranslations } from "next-intl";

export const WithCareForPatient = () => {
  const t = useTranslations("Common");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/patientOnboarding3.png"
          alt="patientOnboarding2"
          className="max-h-[65vh] w-full rounded-2xl"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        C заботой о каждом пациенте
      </div>
      <div className="text-left text-Regular16">
        Мы предусмотрели также другие полезные сервисы: записи в клинике, вызов
        врача и скорой на дом
      </div>
    </div>
  );
};
