import { useTranslations } from "next-intl";

export const QualifiedDoctors = () => {
  const t = useTranslations("Common");
  // const tMob = useTranslations("Mobile.Onboarding");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/patientOnboarding2.png"
          alt="patientOnboarding2"
          className="max-h-[65vh] w-full rounded-2xl"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        Квалифицированные врачи
      </div>
      <div className="text-left text-Regular16">
        Специалисты из более чем 10+ областей медицины. Строгое сохранение
        врачебной тайны и конфиденциальных данных.
      </div>
    </div>
  );
};
