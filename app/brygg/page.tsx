import React from "react"
import Image from "next/image"
import "./bryggpage.css"


const recipes =[
    {name: "Proggepils", ingredients: ["Malt", "Humle", "Vann", "Gjær"], description: "Perfekt for java-søndag"},
    {name:"kompilerings kola", ingredients: ["Malt", "Humle", "Vann", "Gjær"], description: "Perfekt for java-søndag"},
]

export default async function BryggPage() {


    return (
        <div className ="p-5 flex content-center items-center flex-col">
            <h1 className="text-white text-4xl text-center font-bold outline-black outline-2">
                Velkommen til bryggesiden
            </h1>
            <div className="p-5 flex gap-5 mt-5 justify-center align-middle">
                 <Image src="/proggepils.webp" width={1000} height={1000} alt="Proggepils logo" className="w-[30%] h-[500px] object-cover rounded-lg border-2 border-white transition-all duration-500 ease-in-out hover:w-[40%]"/>
                 <Image src="/test.webp" width={1000} height={1000} alt="Cachecooler logo" className="w-[30%] h-[500px] object-cover rounded-lg border-2 border-white transition-all duration-500 ease-in-out hover:w-[40%]" />
            </div>
        </div>
    )
}