import { useTranslations } from "next-intl";

export const OnlineConsultation = () => {
  // const tMob = useTranslations("Mobile.Onboarding");
  const t = useTranslations("Common");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/patientOnboarding1.png"
          alt="patientOnboarding1"
          className="max-h-[65vh] w-full rounded-2xl"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        Онлайн-консультации 24/7
      </div>
      <div className="text-left text-Regular16">
        Избавьтесь от очередей и получайте качественную медицинскую помощь из
        любой точки мира
      </div>
    </div>
  );
};
