/* eslint-disable tailwindcss/no-contradicting-classname */
import type { FC } from "react";

export const TextStory: FC = () => (
  <div>
    <p className="text-Regular10 text-black">Regular10</p>
    <p className="text-Regular11 text-black">Regular11</p>
    <p className="text-Regular12 text-black">Regular12</p>
    <p className="text-Regular14 text-black">Regular14</p>
    <p className="text-Regular16 text-black">Regular16</p>
    <p className="text-Medium12 text-black">Medium12</p>
    <p className="text-Medium14 text-black">Medium14</p>
    <p className="text-Medium16 text-black">Medium16</p>
    <p className="text-Semibold11 text-black">Semibold11</p>
    <p className="text-Semibold12 text-black">Semibold12</p>
    <p className="text-Bold11 text-black">Bold11</p>
    <p className="text-Bold12 text-black">Bold12</p>
    <p className="text-Bold14 text-black">Bold14</p>
    <p className="text-Bold16 text-black">Bold16</p>
    <p className="text-Bold20 text-black">Bold20</p>
    <p className="text-Bold24 text-black">Bold24</p>
    <p className="text-Bold32 text-black">Bold32</p>
    {/* for postccs compile */}
    <p
      className="rotate--45 rotate--90 rotate-0 rotate-180 rotate-45 
    rotate-90 text-Regular10 text-blue text-brand-light text-brand-primary text-brand-secondary text-dark 
    text-gray-0 text-gray-1 text-gray-2 text-gray-3 text-gray-icon text-neutralStatus text-positiveStatus text-red"
    >
      custom
    </p>
  </div>
);
