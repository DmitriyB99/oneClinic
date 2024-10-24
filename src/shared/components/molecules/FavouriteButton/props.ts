export interface TopBarProps {
  status?: string;
  isClinic?: boolean;
  title: string;
  id: string;
  refetch?: () => void;
}

export type DecisionTypes = "accept" | "decline" | "activate" | "deactivate";

export interface DecisionModel {
  status: string;
  title: string;
}

export type DecisionObjectMapModel = Record<DecisionTypes, DecisionModel>;
