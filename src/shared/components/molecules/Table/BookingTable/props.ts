export interface BookingType {
  [dateKey: string]: BookingData[] | string;
  key: string;
  workTime: string;
}

export interface BookingData {
  bookingStatus: boolean;
  bookingType: string;
  fromTime: string;
  id: string;
  name: string;
  soon?: boolean;
  toTime: string;
}

export interface BookingTableProps {
  className?: string;
  data?: BookingData[];
}
