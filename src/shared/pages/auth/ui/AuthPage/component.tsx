import type { FC } from "react";
import { useState } from "react";

import { Navbar, SegmentedControl } from "@/shared/components";
import { AuthClient, AuthDoctor } from "@/widgets/auth";

export const AuthPage: FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>("client");

  return (
    <div className="flex h-screen flex-col px-4">
      <Navbar title="Вход" className="mb-2" />
      <SegmentedControl
        options={[
          { label: "Клиент", value: "client" },
          { label: "Врач", value: "doctor" },
        ]}
        size="l"
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
      />
      <div className="mt-3 h-full">
        {activeTab === "client" && <AuthClient />}
        {activeTab === "doctor" && <AuthDoctor />}
      </div>
    </div>
  );
};
