import React from "react"
import Image from "next/image"
import "./bryggpage.css"


const recipes =[
    {name: "Proggepils", ingredients: ["Malt", "Humle", "Vann", "Gjær"], description: "Perfekt for java-søndag"},
    {name:"kompilerings kola", ingredients: ["Malt", "Humle", "Vann", "Gjær"], description: "Perfekt for java-søndag"},
]

export default async function BryggPage() {


    return (
        <div style ={{
            padding: "20px",
            display:"flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <h1 className={"header"}>
                Velkommen til bryggesiden
            </h1>
            <div style={{
                display: "flex",
                marginTop: "20px", // Avstand fra overskriften
                justifyContent: "center",
                alignItems: "center",
                gap: "20px"
            }}>
                 <Image src="/proggepils.webp" width={1000} height={1000} alt="Proggepils logo" className="beer-pics" />
                 <Image src="/test.webp" width={1000} height={1000} alt="Cachecooler logo" className="beer-pics" />
            </div>
        </div>
    )
}