import type { FC } from "react";
import { useCallback, useContext, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { LoadingOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadRequestOption } from "rc-upload/lib/interface";

import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { PlusOutlinedIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

import type { UploadFileProps } from "../models/UploadAvatarProps";

export const UploadAvatar: FC<UploadFileProps> = ({
  setData,
  title,
  imgUrl,
}) => {
  const [imageUrl, setImageUrl] = useState(imgUrl);
  const [imageLoading, setImageLoading] = useState(false);

  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { mutate: updateDoctorProfilePhoto } = useMutation(
    ["updateDoctorProfilePhoto"],
    (data: { file: File; profileId: string }) =>
      doctorsApi?.uploadDoctorProfilePhoto(data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries([
          "getDoctorNameAndIcon",
          "getDoctorProfilePhoto",
        ]);
        setImageUrl(response.data.photoUrl);
        setData?.(response.data.photoUrl ?? "");
        setImageLoading(false);
      },
    }
  );

  const { mutate: updateClinicIconPhoto } = useMutation(
    ["updateClinicIconPhoto"],
    (data: { file: File; clinicId: string }) =>
      clinicsApi?.uploadManagerProfilePhoto(data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries([
          "getClinicNameAndIcon",
          "getClinicProfileInfo",
        ]);
        setImageUrl(response.data.iconUrl);
        setData?.(response.data.iconUrl ?? "");
        setImageLoading(false);
      },
    }
  );

  const updloadFile = (data: UploadRequestOption) => {
    if (user?.role === "doctor") {
      updateDoctorProfilePhoto({
        file: data?.file as File,
        profileId: user?.role_id ?? "",
      });
    } else {
      updateClinicIconPhoto({
        file: data?.file as File,
        clinicId: user?.role_id ?? "",
      });
    }
  };

  const onSendingFile = useCallback(() => {
    setImageLoading(true);
  }, []);

  const uploadButton = useMemo(
    () => (
      <>
        {imageLoading ? <LoadingOutlined /> : <PlusOutlinedIcon size="l" />}
        <div className="text-gray-4">{title}</div>
      </>
    ),
    [imageLoading, title]
  );

  return (
    <Upload
      beforeUpload={onSendingFile}
      showUploadList={false}
      customRequest={updloadFile}
    >
      <div className="mt-6 flex h-25 w-25 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-7 bg-gray-6">
        {imageUrl ? (
          <img src={imageUrl} width="100%" height="100%" alt="avatar" />
        ) : (
          uploadButton
        )}
      </div>
    </Upload>
  );
};
