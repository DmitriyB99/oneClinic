import type { FC } from "react";
import { useCallback } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { CloseOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useTranslations } from "next-intl";

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
  CertificateFormInputs,
  AddCertificateFormProps,
} from "../models/AddCertificateFormProps";

export const AddCertificateForm: FC<AddCertificateFormProps> = ({
  doctorId,
  isOpen,
  setIsOpen,
  onFormSubmit,
  existingCertificates,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MyDoctor");
  const [api, contextHolder] = notification.useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormInputs>({
    defaultValues: {
      certificates: [
        ...existingCertificates,
        { name: "", yearEarned: "", certificateUrl: "" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "certificates",
    control,
  });

  const onSubmit = useCallback(
    (data: CertificateFormInputs) => {
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

  const handleUploadCertificateFile = useCallback(
    async (
      files: File[],
      field: ControllerRenderProps<
        CertificateFormInputs,
        `certificates.${number}.certificateUrl`
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
          <p className="ml-4 mt-3 text-Bold16">{t("Certificates")}</p>
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
                    name={`certificates.${index}.name` as const}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        onBlur={undefined}
                        label={t("Name")}
                      />
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name={`certificates.${index}.yearEarned` as const}
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
                          label={tMob("YearReceived")}
                          value={String(field.value)}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`certificates.${index}.certificateUrl` as const}
                  render={({ field }) => (
                    <InputFile
                      wrapperClassName="mt-6"
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
                          : tMob("AddCopyOfCertificate")
                      }
                      showAsterisk={!field?.value}
                      onChange={async (files) =>
                        await handleUploadCertificateFile(files, field)
                      }
                    />
                  )}
                />
                <Button
                  variant="secondary"
                  className="my-6 w-full"
                  onClick={() => remove(index)}
                >
                  {tMob("RemoveCertificate")}
                </Button>
              </section>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              append({ name: "", yearEarned: "", certificateUrl: "" })
            }
          >
            {tMob("AddAnotherCertificate")}
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
