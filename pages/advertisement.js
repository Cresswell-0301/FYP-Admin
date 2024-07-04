import Slides from "@/components/Slides";
import { mongooseConnect } from "@/lib/mongoose";
import { Slide } from "@/models/Slide";


export default function Avertisement({existingSlides}) {
  console.log("SSslide:"+existingSlides);
  return<>
    <Slides existingSlides={existingSlides}/>
  </>
}

export async function getServerSideProps(){
  await mongooseConnect();
  const existingSlides = await Slide.find();

  return{
    props: {
      existingSlides: JSON.parse(JSON.stringify(existingSlides)),
    },
  }
}