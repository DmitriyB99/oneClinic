import type { FC } from "react";
import { useCallback, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { useRouter } from "next/router";

import type { MyAddressModel } from "@/entities/myProfile";
import { patientAddressesApi } from "@/shared/api/patient/address";
import {
  CloseIcon,
  Button,
  Island,
  Navbar,
  PlusOutlinedIcon,
} from "@/shared/components";
import { RadioSaunet } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

import { MyAddressAddition } from "./myAddressAddition";

export const MyAddresses: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const { user } = useContext(UserContext);
  const router = useRouter();

  // const { data: myAddresses, refetch } = useQuery(["getMyAddresses"], () =>
  //   patientAddressesApi
  //     .getAddress(user?.user_id ?? "")
  //     .then(
  //       (res) =>
  //         res.data?.map((address, index) => ({ ...address, id: index })) ?? []
  //     )
  // );

  const { data: myAddresses, refetch } = useQuery(["getAddresses"], () =>
    patientAddressesApi?.getAddresses()
  );

  // const { mutate: replaceAddress } = useMutation(
  //   ["replaceAddress"],
  //   (remainingAddresses: MyAddressModel[]) =>
  //     patientAddressesApi.deleteAddress(remainingAddresses, user?.user_id ?? "")
  // );

  // const handleDeleteAddress = useCallback(
  //   async (id: number) => {
  //     const remainingAddresses = myAddresses?.filter(
  //       (address) => address.id !== id
  //     );
  //     await replaceAddress(
  //       (remainingAddresses ?? [])?.map((remaingAddress) => ({
  //         ...remaingAddress,
  //         id: undefined,
  //         cityName: undefined,
  //       })) ?? []
  //     );
  //     setTimeout(() => {
  //       refetch();
  //     }, 500);
  //   },
  //   [myAddresses, refetch, replaceAddress]
  // );

  return (
    <div className="bg-white z-[52]">
      <Island className="!px-0 py-4">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-Bold24">Мои адреса</div>
          <div onClick={() => onClose()}>{<CloseIcon />}</div>
        </div>
        <div className="mb-2 px-4">
          {(myAddresses?.data ?? [])?.map(
            ({ city, address, apartment, id }) => (
              <div className="flex h-16 items-center justify-between" key={id}>
                <div className="flex items-center">
                  <RadioSaunet
                    onChange={() => {
                      setCurrentAddress(id);
                    }}
                    checked={id === currentAddress}
                  />
                  <div>
                    {city?.name}, {address} {apartment}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div
          className="flex items-center justify-start pb-4"
          onClick={() => {
            router.push({
              pathname: `/my/addresses/chooseAddress`,
            });
          }}
        >
          <Button
            variant="tertiary"
            className="ml-12 mr-3 flex !h-10 w-10 items-center justify-center rounded-xl !bg-gray-1"
          >
            <PlusOutlinedIcon />
          </Button>
          <div>Добавить адрес</div>
        </div>
      </Island>
    </div>
  );
};
