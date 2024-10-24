import type { FC } from "react";
import { useState } from "react";

import { LikedHeartIcon, UnlikedHeartIcon } from "../../atoms";

interface LikeButtonProps {
  initialLiked?: boolean;
  onToggle?: (liked: boolean) => void;
}

export const LikeButton: FC<LikeButtonProps> = ({
  initialLiked = false,
  onToggle,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleToggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onToggle) {
      onToggle(newLikedState);
    }
  };

  return (
    <div onClick={handleToggleLike} className="cursor-pointer leading-[0]">
      {isLiked ? <LikedHeartIcon /> : <UnlikedHeartIcon color="gray-icon" />}
    </div>
  );
};
