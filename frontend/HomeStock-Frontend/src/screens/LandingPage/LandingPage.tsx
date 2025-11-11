import { FamilyGroupSection } from "./sections/FamilyGroupSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { InventoryManagementSection } from "./sections/InventoryManagementSection";
import { NavigationHeaderSection } from "./sections/NavigationHeaderSection";
import { UserProfileSection } from "./sections/UserProfileSection";

export const LandingPage = (): JSX.Element => {
  const paginationDots = [
    { opacity: "opacity-100" },
    { opacity: "opacity-30" },
    { opacity: "opacity-30" },
  ];

  return (
    <div className="bg-white overflow-hidden w-full min-w-[1002px] relative">
      <NavigationHeaderSection />
      <HeroSection />
      <UserProfileSection />
      <FamilyGroupSection />
      <InventoryManagementSection />
      <FooterSection />

      <img
        className="absolute top-[17px] left-[30px] w-6 h-6"
        alt="Element user interface"
        src="/24-user-interface-user.svg"
      />

      <div className="absolute top-[613px] left-[489px] w-8 h-[30px] flex">
        <img
          className="mt-[2.2px] w-[22.5px] h-[25.5px] ml-[-0.8px]"
          alt="Location"
          src="/location.png"
        />
      </div>

      <img
        className="absolute top-[616px] left-[786px] w-6 h-6"
        alt="Element user interface"
        src="/24-user-interface-edit-2.svg"
      />
    </div>
  );
};
