import type { Key } from "react";

import type { TableProps } from "antd";

import type { ClinicDoctorStatus } from "@/shared/api/dtos";
export interface EarningDataType {
  date: string;
  earnings: string[];
  patientName: string;
  service: string[];
}
export interface PatientsDataType {
  patientName: string;
  phoneNumber: string;
}
export interface DoctorsDataType {
  id: string;
  doctorName: string;
  phoneNumber: string;
  specialization: string;
  status: ClinicDoctorStatus;
}
export interface RegistrationRequestsDataType {
  name: string;
  phoneNumber: string;
  request: string;
  status: string;
}

export type TableColumnModels =
  | EarningDataType
  | PatientsDataType
  | DoctorsDataType
  | RegistrationRequestsDataType;

export interface DefaultTableProps extends TableProps<TableColumnModels> {
  selectDataList?: (newSelectedRowKeys: Key[]) => void;
}
