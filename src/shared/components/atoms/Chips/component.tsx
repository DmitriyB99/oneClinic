import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";

import type { ChipModel } from "@/shared/components";
import { Carousel } from "@/shared/components";

import type { ChipLabelType, ChipsProps } from "./props";
import { Chip } from "../Chip";

export const Chips: FC<ChipsProps> = ({
  chipLabels = [],
  type,
  className,
  isCarousel = true,
  onChange,
  defaultValue,
}) => {
  const [labels, setLabels] = useState<ChipLabelType[]>([]);
  const [localChipLabels, setLocalChipLabels] = useState(chipLabels);
  useEffect(() => {
    setLocalChipLabels((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(chipLabels)) {
        return prev;
      } else {
        return chipLabels;
      }
    });
  }, [chipLabels]);

  useEffect(() => {
    if (typeof localChipLabels?.[0] === "string") {
      setLabels(
        (localChipLabels as string[]).map((label, index) => ({
          id: index,
          isActive: type === "suggest" || label === defaultValue,
          label: label,
        }))
      );
    } else {
      setLabels(
        (localChipLabels as ChipModel[])?.map((chip, index) => ({
          id: index,
          isActive: type === "suggest" || !!chip?.isActive || chip.label === defaultValue,
          label: chip?.label,
          isDisabled: chip?.isDisabled,
        }))
      );
    }
  }, [localChipLabels, type, defaultValue]);

  const handleMultiSelectChange = useCallback(
    (id: string): string[] | undefined | string => {
      if (type === "suggest") return id;
      const newLabels = labels?.map((chip) => {
        if (chip.id === id) {
          return {
            ...chip,
            isActive: type === "single" ? true : !chip.isActive,
          };
        } else if (chip.isActive && type === "single") {
          return {
            ...chip,
            isActive: false,
          };
        }
        return chip;
      });
      setLabels(newLabels);
      return newLabels
        ?.filter((chip) => chip.isActive)
        .map((chip) => chip.label);
    },
    [labels, type]
  );

  return isCarousel ? (
    <div className={clsx("my-5", className)}>
      <Carousel
        free
        items={
          labels?.map((chip) => (
            <Chip
              onChange={() => {
                onChange?.(handleMultiSelectChange(chip.id as string));
              }}
              disabled={chip.isDisabled}
              checked={chip.isActive}
              key={chip.id}
              label={chip.label}
              type={type}
            />
          )) ?? []
        }
      />
    </div>
  ) : (
    <div className={clsx("my-5", className)}>
      {labels?.map((chip) => (
        <Chip
          onChange={() => {
            onChange?.(handleMultiSelectChange(chip.id as string));
          }}
          disabled={chip.isDisabled}
          checked={chip.isActive}
          key={chip.id}
          label={chip.label}
          type={type}
        />
      ))}
    </div>
  );
};
