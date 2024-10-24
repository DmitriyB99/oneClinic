import type { Key, FC } from "react";
import { useState, useMemo, useCallback } from "react";

import { Table as AntdTable } from "antd";

import type { DefaultTableProps } from "./props";

export const DefaultTable: FC<DefaultTableProps> = ({
  selectDataList,
  ...rest
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const onSelectChange = useCallback(
    (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      selectDataList?.(newSelectedRowKeys);
    },
    [selectDataList]
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [selectedRowKeys, onSelectChange]
  );

  return (
    <AntdTable
      rowSelection={selectDataList ? rowSelection : undefined}
      pagination={{ pageSize: 9 }}
      {...rest}
    />
  );
};
