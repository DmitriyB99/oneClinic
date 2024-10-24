import { useState } from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, Island, List, TabsPagination } from "@/shared/components";

export default {
  title: "OneClinic/TabsPagination",
  component: TabsPagination,
} as unknown as ComponentMeta<typeof TabsPagination>;

const Template: ComponentStory<typeof TabsPagination> = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-gray-bgCard">
      <TabsPagination
        items={[
          <div key="test1">
            <img src="/onboard1.jpeg" alt="onboard1" />
            <Island>
              <p className="mb-4 text-Bold20">Консультации</p>
              <p className="mb-3 text-Regular16">
                OneClinic - это быстрый и удобный способ получить медицинскую
                помощь! В любое время и без очередей.
              </p>
              <List
                items={[
                  {
                    id: "1",
                    title: "Онлайн и оффлайн",
                    description: "Не теряйте время в очередях на прием",
                  },
                  {
                    id: "2",
                    title: "В любое время",
                    description: "Дежурный врач поможет даже ночью",
                  },
                  {
                    id: "3",
                    title: "Медицинская карта",
                    description: "Храним историю консультаций и лечения",
                  },
                ]}
              />
              <Button
                block
                variant="secondary"
                onClick={() => setActive(1)}
                className="my-4"
              >
                Продолжить
              </Button>
            </Island>
          </div>,
          <div key="test2">
            <img src="/onboard2.jpeg" alt="onboard2" />
            <Island>
              <p className="mb-4 text-Bold20">Квалифицированные врачи</p>
              <p className="mb-3 text-Regular16">
                Профессиональная медицинская помощь. У нас работают только
                опытные врачи с сертификацией и высокими рейтингами.
              </p>
              <List
                items={[
                  {
                    id: "1",
                    title: "Помощь в любой ситуации",
                    description: "Специалисты в разных областях медицины",
                  },
                  {
                    id: "2",
                    title: "Врачебная тайна",
                    description: "Высокие стандарты медицинской этики",
                  },
                  {
                    id: "3",
                    title: "Что у вас болит?",
                    description: "Подбор специалиста по симптомам болезни",
                  },
                ]}
              />
              <Button
                block
                variant="secondary"
                onClick={() => setActive(2)}
                className="my-4"
              >
                Продолжить
              </Button>
            </Island>
          </div>,
          <div key="test3">
            <img src="/onboard3.jpeg" alt="onboard3" />
            <Island>
              <p className="mb-4 text-Bold20">Забота о клиенте</p>
              <p className="mb-3 text-Regular16">
                Ваше здоровье - это ваш главный приоритет, и мы здесь, чтобы
                дать доступ к лучшим врачам и медицинским ресурсам.
              </p>
              <List
                items={[
                  {
                    id: "1",
                    title: "Экспертная консультация",
                    description: "Индивидуальный подход к каждому",
                  },
                  {
                    id: "2",
                    title: "Полезные статьи",
                    description: "Советы по профилактике и уходу за здоровьем",
                  },
                  {
                    id: "3",
                    title: "Уведомления",
                    description: "Напомним предстоящих визитах и лекарствах",
                  },
                ]}
              />
              <Button block onClick={() => setActive(0)} className="my-4">
                Начать
              </Button>
            </Island>
          </div>,
        ]}
        activeIndex={active}
      />
    </div>
  );
};

export const Default = Template.bind({});
