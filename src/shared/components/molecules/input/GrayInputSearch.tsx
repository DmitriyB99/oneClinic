import type { CSSProperties, FC } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRouter } from "next/router";

import { SearchIcon } from "../../atoms";

interface InputSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  placeholder: string;
  searchType: string;
}

const placeholderStyle: CSSProperties = {
  fontSize: "16px",
  color: "#9C9C9C",
};

export const GrayInputSearch: FC<InputSearchProps> = ({
  searchValue,
  setSearchValue,
  placeholder,
  searchType,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
      <SearchIcon className=" text-gray-icon" width={30} height={30} />
      <Input
        placeholder={placeholder}
        className="!border-none bg-gray-2 !text-Regular16	!text-black shadow-none"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        style={{ ...placeholderStyle }}
        onFocus={() => router.push(`/search?searchType=${searchType}`)}
      />
      <CloseOutlined
        className="ml-3 cursor-pointer text-gray-icon"
        onClick={() => setSearchValue("")}
      />
    </div>
  );
};
