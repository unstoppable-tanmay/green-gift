import { MarketingCampaign } from "@prisma/client";
import React from "react";

const BannerCard = ({
  marketingCampaign,
}: {
  marketingCampaign: MarketingCampaign;
}) => {
  return (
    <div className="bg-gray-400 w-full h-full rounded-3xl overflow-hidden relative group">
      <img
        src={marketingCampaign.image}
        alt=""
        className="w-full h-full object-cover absolute"
      />
      <div className="layer absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/70 duration-500"></div>
      <div
        className="view-more absolute top-0 left-0 w-full h-full font-poppins font-semibold text-3xl tracking-wider uppercase flex
       items-center justify-center m-[-100%] text-white group-hover:m-0 duration-500"
      >
        <div className="text">{marketingCampaign.name}</div>
      </div>
      <div
        className="view-more absolute top-0 left-0 w-full h-full font-poppins flex
       items-center justify-center m-[100%] text-white group-hover:m-0 duration-500"
      >
        <div className="text translate-y-[100%] w-[clamp(200px,600px,90vw)] line-clamp-3 text-center">
          {marketingCampaign.description}
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
