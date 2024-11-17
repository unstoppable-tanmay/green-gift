/* eslint-disable @next/next/no-img-element */
import React from "react";
import clsx from "clsx";

import { createPortal } from "react-dom";

const Loader = ({
  fullScreen,
  transparency = "1",
  width,
  height,
  isLoading,
}: {
  fullScreen?: boolean;
  transparency?: string;
  width?: string | number;
  height?: string | number;
  isLoading: boolean;
}) => {
  if (!isLoading) return null;
  return (
    <div
      className={clsx(
        `flex items-center justify-center w-full h-full z-[1000] top-0 left-0 bg-white`,
        fullScreen ? "sticky w-screen h-screen" : "absolute",
        width && `w-${width}`,
        height && `h-${height}`
      )}
      style={
        transparency
          ? {
              backgroundColor: `rgba(245, 244, 224, ${transparency})`,
            }
          : {}
      }
    >
      <img
        src="/plant_loader.gif"
        alt=""
        className="w-[220px] aspect-square object-cover bg-blend-difference"
      />
    </div>
  );
};

export default Loader;

const LoaderWithPortal = (props: {
  fullScreen?: boolean;
  transparency?: string;
  width?: string | number;
  height?: string | number;
  isLoading: boolean;
  portal?: boolean;
}) => {
  const { portal, ...rest } = props;

  if (portal) {
    return createPortal(<Loader {...rest} />, document.body);
  }

  return <Loader {...rest} />;
};

export { LoaderWithPortal };
