import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from "next/navigation";

const SidebarItems = ({
  openHandler,
  state,
  items,
  name,
  mainUrl,
}: {
  items: { name: string; url: string }[];
  openHandler?: () => void;
  state?: boolean;
  name: string;
  mainUrl?: string;
}) => {
  const router = useRouter();

  return (
    <>
      <li>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => {
            if (items.length === 0) {
              router.push(mainUrl!);
            } else {
              if (openHandler) {
                openHandler();
              }
            }
          }}
        >
          <span>{name}</span>
          {items.length > 0 &&
            (state ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </div>
        {items.length > 0 && state && (
          <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-700">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  router.push(item.url);
                }}
                className="cursor-pointer my-4 hover:text-[#053BA8] transition-all duration-300"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default SidebarItems;
