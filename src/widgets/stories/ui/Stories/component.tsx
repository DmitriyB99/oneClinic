import type { FC } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Dropdown, Spin } from "antd";
import { useRouter } from "next/router";
import Stories from "stories-react";

import "stories-react/dist/index.css";

import type { LanguageCode } from "@/shared/api";
import { storiesApi } from "@/shared/api/stories";
import {
  ArrowLeftIcon,
  Button,
  CarouselSlide,
  Carousel,
  CloseIcon,
  Dialog,
  InteractiveList,
  Island,
  LocationPoint,
  Navbar,
  SaunetMobileIcon,
  Avatar,
} from "@/shared/components";
import { Languages } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";

import { url } from "inspector";
import { dictionaryApi } from "@/shared/api/dictionary";
import { patientSettingsApi } from "@/shared/api/patient/settings";

type Story = {
  pause: () => void;
  resume: () => void;
};

type Countries = "Kazakhstan";

const useLocationData = () => {
  const [activeCountry, setActiveCountry] = useState("");

  const { data: countriesList, refetch: refetchCountries } = useQuery(
    "getCountries",
    () =>
      dictionaryApi.getCountries()?.then(
        (res) =>
          res?.data?.result?.map(({ id, name }) => ({
            id,
            title: name,
          })) ?? []
      ),
    { enabled: false }
  );

  const { data: citiesList, refetch: refetchCities } = useQuery(
    ["getCities", activeCountry],
    () =>
      dictionaryApi.getCities(activeCountry)?.then(
        (res) =>
          res?.data?.result?.map(({ id, name }) => ({
            id,
            title: name,
          })) ?? []
      ),
    { enabled: false }
  );

  return {
    countriesList,
    citiesList,
    refetchCountries,
    refetchCities,
    setActiveCountry,
  };
};

interface StoriesOnMainProps {
  avatarUrl?: string;
  rating?: number;
}

function Story1(props: Story, img: string, close: () => void) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (isLoaded) {
      props.resume();
    } else {
      props.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-dark">
      <Button
        onClick={close}
        variant="tertiary"
        className="absolute right-3 top-3 z-50 h-6 w-6 !p-0"
      >
        <CloseIcon color="white" />
      </Button>
      <img
        // src={img}
        src="storyDoctor.png"
        alt="image1"
        className="h-screen"
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <Spin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}

export const StoriesOnMain: FC<StoriesOnMainProps> = ({
  rating,
  avatarUrl,
}) => {
  const { locale, setLocale, user } = useContext(UserContext);
  const [showStory, setShowStory] = useState<number | undefined>(undefined);
  const [isChooseCityDialogOpen, setIsChooseCityDialogOpen] =
    useState<boolean>(false);
  const [isChooseCountryDialogOpen, setIsChooseCountryDialogOpen] =
    useState<boolean>(false);
  const router = useRouter();
  const isDoctorMainPage = router.pathname === "/mainDoctor";

  const { data, isLoading } = useQuery(["getStories"], storiesApi.getStories, {
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    countriesList,
    citiesList,
    refetchCountries,
    refetchCities,
    setActiveCountry,
  } = useLocationData();

  useEffect(() => {
    if (isChooseCountryDialogOpen) {
      refetchCountries();
    }
  }, [isChooseCountryDialogOpen, refetchCountries]);

  useEffect(() => {
    if (isChooseCityDialogOpen) {
      refetchCities();
    }
  }, [isChooseCityDialogOpen, refetchCities]);

  const { mutate: updatePatientLanguage } = useMutation(
    ["updatePatientLanguage"],
    (newPatientLanguageLocale: LanguageCode) =>
      patientSettingsApi.updateMyLanguage(newPatientLanguageLocale)
  );

  const mockStoriesData = [
    {
      thumbUrl: "promo2.png",
      id: "1",
      src: "promo2.png",
      // title: "Как замерить давление дома?",
      index: 1,
    },
    {
      thumbUrl: "promo1.png",
      id: "2",
      src: "promo1.png",
      // title: "Онлайн-консультация за 499 ₸",
      index: 2,
    },
  ];

  const stories = useMemo(
    () =>
      (data?.data.content || mockStoriesData).map((el: { imgUrl: string }) => ({
        type: "component",
        component: (props: Story) =>
          Story1(props, el.imgUrl, () => setShowStory(undefined)),
      })),
    [data]
  );

  const handleSetLocale = useCallback(
    (loc: string) => {
      setLocale(loc);
      updatePatientLanguage(loc as LanguageCode);
      router.push("/main", "/main", { locale: loc });
    },
    [router, setLocale, updatePatientLanguage]
  );

  const items = useMemo(
    () => ({
      items: Languages.map((language) => ({
        key: language.value,
        label: (
          <div onClick={() => handleSetLocale(language.value)}>
            {language.label}
          </div>
        ),
      })),
    }),
    [handleSetLocale]
  );

  const { userCity, setUserCity } = useContext(UserContext);
  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      {showStory !== undefined && (
        <div className="fixed top-0 z-50 w-full">
          <Stories
            preventDefault
            defaultInterval={5000}
            stories={stories}
            onAllStoriesEnd={() => setShowStory(undefined)}
            currentIndex={showStory}
          />
        </div>
      )}

      <Island className="mb-2 !rounded-b-3xl !rounded-t-none !p-0 !pb-2 !pt-4">
        <div className="mb-2 flex items-center justify-between ">
          <div className="ml-4 flex items-center text-Bold24">
            <SaunetMobileIcon width={109} height={32} />
          </div>
          {isDoctorMainPage ? (
            <div className="mr-4 flex items-center justify-start">
              <div
                className="rounded-xl px-2 py-1 text-Bold14"
                onClick={() => router.push("/myDoctor/statistics")}
              >
                {rating?.toFixed(1) ?? 0} <span className="ml-0.5">⭐</span>
              </div>
              <Avatar size="s" src={avatarUrl} className="ml-3" />
            </div>
          ) : (
            <div className="mr-4 flex items-center">
              <Button
                variant="tinted"
                className="mr-2 flex h-9 w-fit cursor-pointer items-center rounded-3xl bg-gray-0 px-3 text-Regular14"
                onClick={() => {
                  setIsChooseCountryDialogOpen(true);
                }}
              >
                <LocationPoint />
                {userCity}
              </Button>
              <Dropdown menu={items} placement="bottom" arrow>
                <Button
                  variant="tinted"
                  className="mr-2 flex h-9 w-fit cursor-pointer items-center rounded-3xl bg-gray-0 px-3 text-Regular14"
                >
                  {locale}
                </Button>
              </Dropdown>
              {/*<Button*/}
              {/*  className="m-0 !h-9 w-fit rounded-3xl !bg-gray-0 !p-1.5"*/}
              {/*  variant="tertiary"*/}
              {/*>*/}
              {/*  <SearchIcon />*/}
              {/*</Button>*/}
            </div>
          )}
        </div>
        {!isDoctorMainPage && (
          <Island className="mb-2 !p-0 !pt-4">
            <div className="p-4 pt-3">
              <Button
                className="flex w-full items-center justify-between px-4"
                danger
                style={{ boxShadow: "0px 0px 16px 0px #DBA1A1" }}
                size="m"
                onClick={() => router.push("/clinics")}
              >
                <p className="mb-0">Прием в клинике</p>
                <div className="flex items-center space-x-2">
                  <p className="mb-0">14:30</p>
                  <ArrowRightOutlined />
                </div>
              </Button>
            </div>
          </Island>
        )}

        <Carousel
          className="!pb-4 pt-1"
          customSlides
          items={(data?.data.content || mockStoriesData).map(
            (
              el: { id: string; thumbUrl: string; title: string },
              index: number
            ) => (
              <CarouselSlide
                key={el.id}
                isNew
                src={el.thumbUrl}
                onClick={() => setShowStory(index)}
              >
                {el.title}
              </CarouselSlide>
            )
          )}
        />
      </Island>
      <Dialog
        isOpen={isChooseCountryDialogOpen}
        setIsOpen={setIsChooseCountryDialogOpen}
        className="h-full p-0"
      >
        <Navbar
          title="Выберите вашу страну"
          buttonIcon={<ArrowLeftIcon />}
          leftButtonOnClick={() => {
            setIsChooseCountryDialogOpen(false);
          }}
          className="!p-0"
        />
        <InteractiveList
          list={countriesList ?? []}
          onClick={(countryName) => {
            setActiveCountry(countryName as Countries);
            setIsChooseCityDialogOpen(true);
          }}
        />
        <Dialog
          isOpen={isChooseCityDialogOpen}
          setIsOpen={setIsChooseCityDialogOpen}
          className="h-full p-0"
        >
          <Navbar
            title="Выберите ваш город"
            buttonIcon={<ArrowLeftIcon />}
            leftButtonOnClick={() => {
              setIsChooseCityDialogOpen(false);
            }}
            className="!p-0"
          />
          <InteractiveList
            list={citiesList ?? []}
            onClick={(cityId) => {
              setUserCity(
                citiesList?.find((city) => city?.id === cityId)?.title ?? ""
              );
              setIsChooseCityDialogOpen(false);
              setIsChooseCountryDialogOpen(false);
            }}
          />
        </Dialog>
      </Dialog>
    </>
  );
};
