import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

interface Tab {
  title: string;
  id: string;
}

interface SwitchProps {
  tabs: Tab[];
  tab: string;
  setTab: (id: string) => void;
  color?: boolean;
}

const Item = ({
  title,
  id,
  tab,
  ind,
  setTab,
  setPos,
  setWidth,
  color,
}: {
  title: string;
  id: string;
  tab: string;
  ind: number;
  setTab: (id: string) => void;
  setPos: (pos: number) => void;
  setWidth: (width: number) => void;
  color: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tab === id) {
      setPos(ref.current?.offsetLeft ?? 0);
      setWidth(ref.current?.offsetWidth ?? 0);
    }
  }, []);
  return (
    <div
      ref={ref}
      className={clsx(
        color
          ? `cursor-pointer whitespace-nowrap w-7 aspect-square rounded-full`
          : `cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm text-center flex justify-center items-center z-10`,
        color && `bg-[${title}]`
      )}
      style={{
        background: color ? title : undefined,
      }}
      onClick={(item) => {
        setTab(id);
        setPos(ref.current?.offsetLeft ?? 0);
        setWidth(ref.current?.offsetWidth ?? 0);
      }}
    >
      {!color && title}
    </div>
  );
};

const Switch: React.FC<SwitchProps> = ({
  tabs,
  tab,
  setTab,
  color = false,
}) => {
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState(0);

  if (tabs.length > 4 && !color)
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((item, ind) => (
          <div
            className={clsx(
              "px-4 py-0.5 rounded-full cursor-pointer border-2 text-sm border-gray-300",
              tab === item.id && "bg-gray-300"
            )}
            key={ind}
          >
            {item.title}
          </div>
        ))}
      </div>
    );

  return (
    <div
      className={clsx(
        "relative flex rounded-full w-min",
        !color && "bg-gray-200",
        color && "gap-1"
      )}
    >
      {tabs.map((item, ind) => (
        <Item
          ind={ind}
          key={item.id}
          title={item.title}
          id={item.id}
          tab={tab}
          setTab={setTab}
          setPos={setPos}
          setWidth={setWidth}
          color={color}
        />
      ))}
      <div
        className={
          color
            ? "absolute top-0 left-0 h-full border-2 border-gray-600 rounded-full transition-all duration-200 z-5"
            : "absolute top-0 left-0 h-full bg-gray-400 rounded-full transition-all duration-200 z-5"
        }
        style={{
          width: width,
          left: pos,
        }}
      ></div>
    </div>
  );
};

export default Switch;
