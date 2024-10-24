import type { FC } from "react";

export const PatientMedicalCard: FC = () => (
  <>
    <div className="mt-2 text-Bold20">Данные</div>
    <div className="mt-6 text-Regular12 text-secondaryText">
      Номер телефона пациента
    </div>
    <div className="mt-1">+7 771 490 34 23</div>
    <div className="mt-9 text-Bold20">Аллергия</div>
    <div className="mt-6 text-Regular12 text-secondaryText">Пищевая</div>
    <div className="mt-1">Яйца</div>
    <div className="mt-6 text-Regular12 text-secondaryText">Бытовая</div>
    <div className="mt-1">Кошачья или собачья шерсть</div>
  </>
);
