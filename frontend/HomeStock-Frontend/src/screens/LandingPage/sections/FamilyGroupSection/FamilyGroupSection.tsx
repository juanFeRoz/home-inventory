import { FileTextIcon, LightbulbIcon, ShoppingCartIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: ShoppingCartIcon,
    title: "Crea tu lista de compra",
    description:
      "Añade productos a una lista de compra, regístralos según la ubicación que necesites y según el tipo que sean.",
  },
  {
    icon: FileTextIcon,
    title: "Visualiza tus reportes",
    description:
      "Solicita los reportes de cada ubicación del inventario para visualizar los artículos caducados, la cantidad según cierta categoría y cuantos dispones en el inventario.",
  },
  {
    icon: LightbulbIcon,
    title: "Cuida tu inventario",
    description:
      "El sistema avisará cuando un producto esté por caducar, revisa tu lista de compras y cámbialo !",
  },
];

export const FamilyGroupSection = (): JSX.Element => {
  return (
    <section className="w-full py-0 px-0">
      <div className="flex items-center justify-center gap-6 px-[100px]">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={index}
              className="w-52 h-[230px] bg-[#e8f5e9] rounded-[5.57px] shadow-[0px_1.39px_2.78px_#abbed133] border-0"
            >
              <CardContent className="flex flex-col items-center gap-[5.57px] px-[22.27px] py-[16.71px] h-full">
                <div className="flex flex-col w-[185.85px] items-center gap-[11.14px]">
                  <div className="relative w-[45.24px] h-[38.98px] flex items-center justify-center">
                    <div className="absolute w-[35px] h-[34px] bg-[#b2ffb8] rounded-[12.53px_3.48px_6.96px_3.48px]" />
                    <IconComponent className="relative w-6 h-6 text-neutraldgrey z-10" />
                  </div>

                  <h3 className="text-center [font-family:'Inter',Helvetica] font-bold text-neutraldgrey text-[19.5px] tracking-[0] leading-[25.1px]">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-center [font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] tracking-[0] leading-[13.9px]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
