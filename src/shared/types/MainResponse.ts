export interface MainResponse {
  myPatientCount: number;
  bookingState: {
    all: number;
    canceled: number;
    created: number;
    done: number;
    moved: number;
  };
}
