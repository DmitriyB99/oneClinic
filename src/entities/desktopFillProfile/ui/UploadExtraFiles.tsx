import type { FC } from "react";
import { useContext } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadRequestOption } from "rc-upload/lib/interface";

import { doctorsApi } from "@/shared/api";
import { UserContext } from "@/shared/contexts/userContext";

import type { UploadExtraFilesProps } from "../models/UploadAvatarProps";

export const UploadExtraFiles: FC<UploadExtraFilesProps> = ({
  title,
  setExtraFileUrl,
}) => {
  const { user } = useContext(UserContext);
  const updloadFile = (data: UploadRequestOption) => {
    doctorsApi
      .uploadExtraFiles(user?.role_id ?? "", data?.file as File)
      .then((response) => {
        setExtraFileUrl(response.data.fullPath);
        data.onSuccess?.("success");
      });
  };
  return (
    <Upload maxCount={1} accept="application/pdf" customRequest={updloadFile}>
      <Button className="mt-5" icon={<UploadOutlined />}>
        {title}
      </Button>
    </Upload>
  );
};
