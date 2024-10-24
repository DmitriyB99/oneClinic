import { useCallback, useContext, useMemo } from "react";
import { useQuery } from "react-query";

import { Dropdown } from "antd";
import { useRouter } from "next/router";

import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { Avatar, SaunetMobileIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { convertStringToAvatarLabel } from "@/shared/utils";

export const DesktopNavbar = () => {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const { data: doctorData } = useQuery(
    ["getDoctorNameAndIcon"],
    () => doctorsApi.getMyDoctorProfile().then((res) => res.data),
    {
      enabled: user?.role === "doctor",
    }
  );

  const { data: clinicData } = useQuery(
    ["getClinicNameAndIcon"],
    () => clinicsApi.getClinicMe().then((res) => res.data),
    {
      enabled: user?.role === "clinic",
    }
  );

  const logoutFunc = useCallback(() => {
    logout();
    router.push("/desktop/login");
  }, [logout, router]);

  const items = useMemo(
    () => ({
      items: [
        {
          key: "logout",
          label: <div onClick={logoutFunc}>Logout</div>,
        },
      ],
    }),
    [logoutFunc]
  );

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-darkBlue">
      <div className="ml-4">
        <SaunetMobileIcon height={60} size="xxl" />
      </div>
      <Dropdown menu={items} placement="bottom" arrow>
        <div className="mr-6">
          <Avatar
            src={doctorData?.photoUrl ?? clinicData?.iconUrl}
            text={convertStringToAvatarLabel(
              doctorData?.firstName ?? clinicData?.name
            )}
            size="xs"
            className="bg-white text-black"
          />
        </div>
      </Dropdown>
    </header>
  );
};
