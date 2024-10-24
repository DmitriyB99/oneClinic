export interface UploadFileProps {
  setData?: (data: string) => void;
  title: string;
  imgUrl?: string;
}

export interface UploadExtraFilesProps {
  title: string;
  setExtraFileUrl: (url: string) => void;
}
