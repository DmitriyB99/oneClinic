import type { Dispatch, SetStateAction } from "react";

import type { MyShortInfoModel } from "@/entities/myProfile";

export interface NewBookingDataSearchProps {
  setSearchSubmit: Dispatch<SetStateAction<boolean>>;
  setSubmit: Dispatch<SetStateAction<boolean>>;
  setUserDataForm: Dispatch<SetStateAction<MyShortInfoModel | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
