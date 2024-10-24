import type { FC } from "react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

import {
  ArrowLeftIcon,
  Button,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
  Navbar,
  SpinnerWithBackdrop,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { dictionaryApi } from "@/shared/api/dictionary";
import { patientAddressesApi } from "@/shared/api/patient/address";

export const MyAddressAddition: FC<{ refetch: () => void }> = ({ refetch }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: cities } = useQuery(["getCities"], () =>
    dictionaryApi.getCities().then((res) => res?.data?.result ?? [])
  );
  const { userCity, user } = useContext(UserContext);

  const { mutate: addAddress } = useMutation(["addAddress"], () =>
    patientAddressesApi
      .addAddress(
        {
          type: "DEFAULT",
          street,
          buildNumber,
          cityId: activeCityId,
        },
        user?.user_id ?? ""
      )
      .then(() => {
        refetch();
      })
  );

  const [activeCityId, setActiveCityId] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [buildNumber, setBuildNumber] = useState<string>("");

  const activeCityName = useMemo(
    () => cities?.find((city) => city.id === activeCityId)?.name,
    [activeCityId, cities]
  );

  useEffect(() => {
    setActiveCityId(
      cities?.find(
        (city) =>
          userCity?.toLowerCase() === city?.name?.toLowerCase()
      )?.id ?? ""
    );
  }, [cities, userCity]);

  const dropdownMenuItems = useMemo(
    () =>
      (cities ?? [])?.map(({ id, name }, index) => ({
        key: id,
        label: (
          <>
            <div className="py-2 text-Regular16">{name}</div>
            {index !== (cities?.length ?? 0) - 1 && (
              <DividerSaunet className="m-0 p-0" />
            )}
          </>
        ),
        onClick: ({ key }: { key: string }) => {
          setActiveCityId(key);
        },
      })),
    [cities]
  );

  return (
    <>
      <Button
        variant="tertiary"
        className="ml-12 mr-3 flex !h-10 w-10 items-center justify-center rounded-xl !bg-gray-1"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PlusOutlined />
      </Button>
      <Dialog
        darkenBackground={false}
        isOpen={open}
        setIsOpen={setOpen}
        className="!p-0"
      >
        <Island>
          <Navbar
            title="Добавить адрес"
            leftButtonOnClick={() => setOpen(false)}
            buttonIcon={<ArrowLeftIcon />}
            className="mb-4 !p-0"
          />
          <InputText
            label="Улица"
            name="street"
            wrapperClassName="my-4"
            value={street}
            onChange={(event) => {
              setStreet(event.target.value);
            }}
            showAsterisk={false}
          />
          <InputText
            label="Дом/здание"
            name="buildNumber"
            wrapperClassName="my-4"
            value={buildNumber}
            onChange={(event) => {
              setBuildNumber(event.target.value);
            }}
            showAsterisk={false}
          />
          <div className="mb-4 rounded-xl bg-gray-1 p-4">
            <Dropdown
              overlayClassName="w-full px-4 pt-6"
              menu={{
                items: dropdownMenuItems,
              }}
            >
              <div className="flex cursor-pointer">
                <div className="mr-1 whitespace-pre">{activeCityName}</div>
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              await addAddress();
              setOpen(false);
            }}
          >
            Добавить
          </Button>
        </Island>
      </Dialog>
    </>
  );
};
