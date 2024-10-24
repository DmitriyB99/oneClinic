import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import type { DoctorProfile } from "@/entities/clinics";
import { doctorsApi } from "@/shared/api";
import { chatApi } from "@/shared/api/chat";
import {
  ArrowLeftIcon,
  Avatar,
  Button,
  DefaultCell,
  Dialog,
  InputText,
  Navbar,
} from "@/shared/components";

export const ChatCreateGroupDialog: FC<{
  isOpen: boolean;
  toggleDialog: (val: boolean) => void;
  update: () => void;
}> = ({ isOpen, toggleDialog, update }) => {
  const [selectedUsers, setSelectedUsers] = useState<DoctorProfile[]>([]);
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(1);

  // const { data: doctors } = useQuery(
  //   ["getDoctorsForChat"],
  //   () => doctorsApi.getDoctor({}).then((response) => response.data.result),
  //   {
  //     retry: false,
  //     retryOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const fakeDoctors: DoctorProfile[] = [
    {
      doctorId: "1",
      userId: "user1",
      fullName: "Иван Иванов",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      doctorId: "2",
      userId: "user2",
      fullName: "Анна Петрова",
      photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      doctorId: "3",
      userId: "user3",
      fullName: "Алексей Смирнов",
      photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      doctorId: "4",
      userId: "user4",
      fullName: "Ольга Соколова",
      photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      doctorId: "5",
      userId: "user5",
      fullName: "Дмитрий Кузнецов",
      photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    },

    {
      doctorId: "6",
      userId: "user5",
      fullName: "Дмитрий Кузнецов",
      photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      doctorId: "7",
      userId: "user5",
      fullName: "Дмитрий Кузнецов",
      photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];
  const doctors = fakeDoctors;

  const handleClickUser = useCallback(
    (doctor: DoctorProfile) => {
      const foundIndex = selectedUsers.findIndex(
        (tempDoc) => tempDoc.doctorId === doctor.doctorId
      );
      if (foundIndex !== -1) {
        const tempUsers = [...selectedUsers];
        tempUsers.splice(foundIndex, 1);
        setSelectedUsers(tempUsers);
      } else {
        setSelectedUsers((prev) => [...prev, doctor]);
      }
    },
    [selectedUsers]
  );

  const { mutate: createGroupChat } = useMutation(
    ["createGroupChat"],
    (data: { members: string[]; name: string }) =>
      chatApi?.createGroupChat(data),
    {
      onSuccess: () => {
        toggleDialog(false);
        update();
      },
    }
  );

  const members = useMemo(
    () => selectedUsers.map((user) => user.userId),
    [selectedUsers]
  );

  return (
    <Dialog isOpen={isOpen} setIsOpen={toggleDialog}>
      <>
        {step === 1 && (
          <div>
            <Navbar
              title="Кого вы хотите добавить?"
              description={`${selectedUsers.length + 1}/5 участников`}
              leftButtonOnClick={() => toggleDialog(false)}
              buttonIcon={<ArrowLeftIcon />}
              className="px-4"
            />
            {doctors?.map((doctor) => (
              <DefaultCell
                key={doctor.doctorId}
                checked={
                  !!selectedUsers.find(
                    (tempDoc) => tempDoc.doctorId === doctor.doctorId
                  )
                }
                title={doctor.fullName}
                mainIcon={<Avatar size="s" src={doctor?.photoUrl} />}
                caption="Врач"
                onCheckboxChange={() => handleClickUser(doctor ?? "")}
                rightElement={<></>}
              />
            ))}
            {selectedUsers.length > 1 && (
              <div className="sticky bottom-0 left-0 mt-4 w-full">
                <Button block onClick={() => setStep(2)}>
                  <p className="mb-0">Продолжить</p>
                  <p className="mb-0">
                    {selectedUsers.length + 1} участника, включая вас
                  </p>
                </Button>
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <Navbar
              title="Группа"
              leftButtonOnClick={() => setStep(1)}
              buttonIcon={<ArrowLeftIcon />}
              rightIcon={<div>Создать</div>}
              rightIconOnClick={() => {
                createGroupChat({ name: title, members: members as string[] });
              }}
              className="px-4"
            />
            <div className="p-4 text-Bold20">Название группы</div>
            <InputText
              label="Наименование"
              name="name"
              value={title}
              onChange={(eve) => setTitle(eve.target.value)}
            />
            <div className="p-4 text-Bold20">Участники</div>
            {selectedUsers?.map((doctor) => (
              <DefaultCell
                key={doctor.doctorId}
                className="h-auto py-3"
                title={doctor.fullName}
                mainIcon={<Avatar size="s" src={doctor?.photoUrl} />}
                caption="Врач"
                rightElement={<></>}
              />
            ))}
          </div>
        )}
      </>
    </Dialog>
  );
};
