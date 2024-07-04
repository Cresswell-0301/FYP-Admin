import Layout from '@/components/Layout';
import Title from '@/components/Title';
import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import Spinner from "@/components/Spinner";
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Slides({existingSlides}) {
  console.log("Exslide:"+existingSlides);
  const [slides, setSlides] = useState(existingSlides || []);
  const [newSlides, setNewSlides] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const saveSlides = async () => {
        try {
            await axios.post('/api/slides', newSlides);
            toast.success("Slide created");
        } catch (error) {
            console.error("Error creating slide:", error);
            toast.error("Failed to create slide");
        }
    };

    if (newSlides.length > 0) {
        saveSlides();
    }
  }, [newSlides]);

  function updateSlideOrder(exsitingSlides) {
    setSlides(exsitingSlides);
  }

  async function uploadSlide(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await axios.post('/api/upload', data);
        setSlides(oldSlide => [...oldSlide, ...res.data.links]);
        setNewSlides(res.data.links); //newSlides.length > 0 ?  setNewSlides(prevslide => [...prevslide, ...res.data.links]) :   
        console.log("ns:" + newSlides);
      } catch (error) {
        console.error("Error uploading slide:", error);
      }
      setIsUploading(false);
    }
  }

  const removeSlide = async (_id, index) => {
    console.log("ID:"+_id);
    try {
      // const removedSlide = slide[index]; 
      if(!_id){
        const updatedSlides = slides.filter((_, i) => i !== index); 
        setSlides(updatedSlides);
        toast.success("Slide removed"); 
        return;
      }
      
      const updatedSlides = slides.filter((_, i) => i !== index); 
      setSlides(updatedSlides); 

      await axios.delete(`/api/slides?id=${_id}`); 
    
      toast.success("Slide removed");
    } catch (error) {
      console.error("Error removing slide:", error);
      toast.error("Failed to remove slide");
    }
  };

  // console.log('slide:'+ slides);
  
  return (
    <Layout>
      <Title>Advertise Slide</Title>
      <form>
        <label>Add Slide</label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
              list={slides}
              className="flex flex-wrap gap-1"
              setList={updateSlideOrder}>
              {!!slides?.length && slides.map((link, index) => (
              <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-sm border border-gray-200">
                  <button className="text-black float-right text-l pl-1" onClick={() => removeSlide(link._id, index)}><MdCancel /></button>
                  <img src={link.slides ? link.slides : link} alt="" className="rounded-md"/>
              </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1  rounded-sm bg-white shadow-sm border border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div>
                  Add Slide
              </div>
              <input type="file" onChange={uploadSlide} className="hidden"/>
          </label>
      </div>
        {/* <button className="btn-primary" type="submit">
          Save
        </button> */}
      </form>
    </Layout>
  );

}