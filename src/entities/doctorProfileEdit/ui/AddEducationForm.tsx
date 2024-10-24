import type { FC } from "react";
import { useCallback } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { CloseOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useTranslations } from "next-intl";
import { academicDegrees } from "@/shared/constants";

import { doctorsApi } from "@/shared/api";
import {
  Button,
  CloseIcon,
  DatePicker,
  Dialog,
  IconPlaceholder,
  InputFile,
  InputText,
} from "@/shared/components";

import type {
  EducationFormInputs,
  AddEducationFormProps,
} from "../models/AddEducationFormProps";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { useQuery } from "react-query";
import { dictionaryApi } from "@/shared/api/dictionary";

export const AddEducationForm: FC<AddEducationFormProps> = ({
  doctorId,
  isOpen,
  setIsOpen,
  onFormSubmit,
  existingStudyDegrees,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MyDoctor");
  const [api, contextHolder] = notification.useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormInputs>({
    defaultValues: {
      studyDegrees: [
        ...existingStudyDegrees,
        { name: "", degree: "", yearStart: "", yearEnd: "", diplomaUrl: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "studyDegrees",
    control,
  });

  const { data: universities } = useQuery(["getUniversities"], () =>
    dictionaryApi.getUniversities().then((response) =>
      response.data.result.map(
        (university: { code: string; name: string }) => ({
          id: university.code,
          name: university.name ?? "No name",
        })
      )
    )
  );

  const onSubmit = useCallback(
    (data: EducationFormInputs) => {
      onFormSubmit(data);
      setIsOpen(false);
    },
    [onFormSubmit, setIsOpen]
  );

  const handleErrors = useCallback(() => {
    if (Object.keys(errors).length > 0) {
      api["error"]({
        message: tMob("AllRequiredFieldsMustBeFilledIn"),
        duration: 3,
        placement: "bottomRight",
      });
    }
  }, [api, errors, tMob]);

  const handleUploadEducationFile = useCallback(
    async (
      files: File[],
      field: ControllerRenderProps<
        EducationFormInputs,
        `studyDegrees.${number}.diplomaUrl`
      >
    ) => {
      const response = await doctorsApi.uploadExtraFiles(doctorId, files[0]);

      field.onChange(response.data.fullPath);
    },
    [doctorId]
  );

  return (
    <>
      {contextHolder}
      <Dialog className="h-full" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="mb-2 flex w-full items-center justify-between">
          <div />
          <p className="ml-4 mt-3 text-Bold16">{t("Education")}</p>
          <Button variant="tertiary" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <section>
                <div className="mb-6">
                  <Controller
                    control={control}
                    name={`studyDegrees.${index}.name` as const}
                    render={({ field }) => (
                      // <InputText
                      //   {...field}
                      //   onBlur={undefined}
                      //   label={tMob("EducationalInstitution")}
                      // />
                      <InputSelect
                        wrapperClassName="mt-6"
                        label="Учебное заведение"
                        name="medicineName"
                        value={field.value}
                        options={universities ?? []}
                        onChange={(event) =>
                          field.onChange(event?.target?.value)
                        }
                        showAsterisk={false}
                      />
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name={`studyDegrees.${index}.degree` as const}
                  render={({ field }) => (
                    // <SelectAcademicDegree
                    //   inputValue={field.value}
                    //   onSelectAcademicDegree={(id) =>
                    //     field.onChange(id as string)
                    //   }
                    // />
                    <InputSelect
                      wrapperClassName="mt-6"
                      label="Академическая степень"
                      name="academicDegree"
                      value={field.value}
                      options={academicDegrees}
                      onChange={(event) => field.onChange(event?.target?.value)}
                      showAsterisk={false}
                    />
                  )}
                />
                <div className="my-6 flex items-center justify-center gap-4">
                  <Controller
                    control={control}
                    name={`studyDegrees.${index}.yearStart` as const}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        className="w-full !p-0"
                        size="large"
                        picker="year"
                        bordered={false}
                        suffixIcon={null}
                        onChange={(value) =>
                          field.onChange(value?.year().toString() ?? "")
                        }
                        inputRender={(props) => (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          <InputText
                            {...props}
                            label={tMob("StartYear")}
                            value={String(field.value)}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`studyDegrees.${index}.yearEnd` as const}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        className="w-full !p-0"
                        size="large"
                        picker="year"
                        bordered={false}
                        suffixIcon={null}
                        onChange={(value) =>
                          field.onChange(value?.year().toString() ?? "")
                        }
                        inputRender={(props) => (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          <InputText
                            {...props}
                            label={tMob("YearOfEnding")}
                            value={String(field.value)}
                          />
                        )}
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name={`studyDegrees.${index}.diplomaUrl` as const}
                  render={({ field }) => (
                    <InputFile
                      wrapperClassName="mb-6"
                      name="diplomaUpload"
                      accept=".pdf,.doc,.docx"
                      icon={
                        field?.value ? (
                          <CloseOutlined
                            className="cursor-pointer text-black"
                            onClick={() => {
                              field.onChange(null);
                            }}
                          />
                        ) : (
                          <IconPlaceholder color="gray-icon" />
                        )
                      }
                      label={
                        field?.value
                          ? tMob("DocumentUploaded")
                          : tMob("AddCopyOfTheDiploma")
                      }
                      showAsterisk={!field?.value}
                      onChange={async (files) =>
                        await handleUploadEducationFile(files, field)
                      }
                    />
                  )}
                />
                <Button
                  variant="secondary"
                  className="mb-6 w-full"
                  onClick={() => remove(index)}
                >
                  {tMob("DeleteEducation")}
                </Button>
              </section>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              append({
                name: "",
                degree: "",
                yearStart: "",
                yearEnd: "",
                diplomaUrl: "",
              })
            }
          >
            {tMob("AddMoreEducation")}
          </Button>
          <Button
            htmlType="submit"
            variant="primary"
            className="mt-6 w-full"
            onClick={handleErrors}
          >
            {t("Save")}
          </Button>
        </form>
      </Dialog>
    </>
  );
};
