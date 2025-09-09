import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import shirt1 from "@/assets/shirt.png";
import shirt2 from "@/assets/shirt2.png";

export function ShirtCollectionDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white mb-4">
              Experience Our <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Signature Collection
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium streetwear designed for those who understand that style is a form of self-expression
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full p-4">
          <div className="relative group">
            <img
              src={shirt1}
              alt="Deeply Rooted Signature Shirt 1"
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-xl font-bold">Heritage Tee</h3>
              <p className="text-sm">Classic streetwear essential</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src={shirt2}
              alt="Deeply Rooted Signature Shirt 2"
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-xl font-bold">Urban Culture Tee</h3>
              <p className="text-sm">Modern street aesthetic</p>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
