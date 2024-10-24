import type { ReactElement } from "react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

import { RightOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { patientAddressesApi } from "@/shared/api/patient/address";
import {
  ArrowLeftIcon,
  Navbar,
  RadioSaunet,
  DividerSaunet,
  Button,
  PlusOutlinedIcon,
} from "@/shared/components";
import CustomMessage from "@/shared/components/atoms/CustomMessage/component";
import { MainLayout } from "@/shared/layout";

export default function MyAddresses() {
  const t = useTranslations("Common");
  const router = useRouter();
  const { query } = router;

  const { data: myAddresses, refetch } = useQuery(["getAddresses"], () =>
    patientAddressesApi?.getAddresses()
  );

  const { mutate: setDefaultAddress } = useMutation(
    ["setDefaultAddress"],
    (addressId: string) =>
      patientAddressesApi.setDefaultAddress(addressId).then(() => {
        refetch();
      })
  );

  const showMessage = (message) => {
    CustomMessage({ content: message });
  };

  useEffect(() => {
    if (query.message) {
      showMessage(query.message as string);
    }
  }, []);

  const hasAddress = !!myAddresses?.data.length;

  const formatAddress = (option) => {
    const parts = [
      option?.city?.name,
      option?.address,
      option?.entrance && `${option.entrance} подъезд`,
      option?.floor && `${option.floor} этаж`,
      option?.apartment && `${option.apartment} квартира`,
    ];

    return parts.filter(Boolean).join(", ");
  };
  return (
    <div className="bg-white">
      <Navbar
        title="Мои адреса"
        leftButtonOnClick={() => router?.push("/my/profile")}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 pt-4"
      />
      {hasAddress ? (
        <>
          <div className="mb-1 ml-4 text-Bold20">Выберите основной адрес</div>
          <div className="mb-3 ml-4 text-Regular14">
            Адрес будет использоваться для вызова врача, скорой и показа
            ближайших клиник
          </div>

          <div className="px-4">
            {myAddresses?.data?.map((option, index) => (
              <div key={option.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start">
                    <RadioSaunet
                      checked={option.is_default}
                      className="mr-0 py-5"
                      onClick={() => setDefaultAddress(option?.id)}
                    />

                    <div>{formatAddress(option)}</div>
                  </div>
                  <RightOutlined
                    onClick={() => {
                      router.push(`/my/addresses/chooseAddress/${option.id}`);
                    }}
                  />
                </div>
                {index !== (myAddresses?.data?.length ?? 0) - 1 && (
                  <DividerSaunet className="m-0 p-0" />
                )}
              </div>
            ))}
            <div className="flex items-center justify-start py-4">
              <Button
                variant="tertiary"
                className="ml-12 mr-3 flex !h-10 w-10 items-center justify-center rounded-xl !bg-gray-1"
                onClick={() => {
                  router.push("/my/addresses/chooseAddress");
                }}
              >
                <PlusOutlinedIcon />
              </Button>
              <div>Добавить адрес</div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-between px-4">
          <div className="mb-3 mt-20 text-Bold24">Еще нет адресов</div>
          <div className="mb-8 mt-3 px-11 text-center text-Medium16 text-secondaryText">
            Укажите ваш адрес. <br />
            Это нужно показа ближайших клиник для вызова врача или скорой
          </div>
          <Button
            variant="primary"
            className="flex w-full items-center justify-center px-4 text-Medium16"
            onClick={() => {
              router.push("/my/addresses/chooseAddress");
            }}
          >
            <div>Добавить адрес</div>
          </Button>
        </div>
      )}
    </div>
  );
}

MyAddresses.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="h-full bg-white">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
