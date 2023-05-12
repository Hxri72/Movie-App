import React, { useState } from "react";
import { useEffect } from "react";
import { deleteMovie, editWithFile, editWithoutFile, fetchMovies, getDetails } from "../axios/axios";
import "../stylesheets/cards.css";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Swal from 'sweetalert2'

function Cards(props) {
  const [movies, setMovies] = useState([]);
  const [modal, setModal] = useState(false);
  const [viewModal,setViewModal] = useState(false)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchMovies();
      if (response.success && response.length !== 0) {
        setMovies(response.data);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async(e,movieId) => {
    e.preventDefault()
    const data = {
        _id:movieId,
        title: title,
        description: description,
        duration: duration,
        genre: genre,
    };

    if(file===null){
        const response = await editWithoutFile(data)
        if(response.success){
            toast.success(response.message)
            setTimeout(()=>{
                window.location.reload()
            },2000)
        }else{
            toast.error(response.message)
        }
    }else{
        const formData = new FormData();
        formData.append("image", file);

        const response2 = await editWithFile(formData,data)
        if(response2.success){
            toast.success(response2.message)
            setTimeout(()=>{
                window.location.reload()
            },2000)
        }else{
            toast.error(response2.message)
        }
    }
  };

  const handleClick = async(title) => {
   
    setModal(true)
    
    const response = await getDetails({title})
    if(response.success){
        setTitle(response.data[0].title)
        setDescription(response.data[0].description)
        setDuration(response.data[0].duration)
        setGenre(response.data[0].genre)
    }
    
  }

  const handleDelete = async(title) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
        if (result.isConfirmed) {
            const response = await deleteMovie({title})
            if(response.success){
                Swal.fire(
                    'Deleted!',
                    response.message,
                    'success'
                )
                setTimeout(()=>{
                    window.location.reload()
                },2000)
            }
        }
      })
  }

  const handleView = async(e,title) => {
    e.preventDefault()
    setViewModal(true)
    console.log(title)
    const response = await getDetails({title})
    console.log(response)
    if(response.success){
        setTitle(response.data[0].title)
        setDescription(response.data[0].description)
        setDuration(response.data[0].duration)
        setGenre(response.data[0].genre)
    }
  }

  return (
    <>
      {movies.length > 0 ? (
        <div className={movies.length > 1 ? "mainDivCards" : "mainDivCards2"}>
          {movies &&
            movies.map((movie) => (
              <>
                <div className="genreDiv mt-5">
                  <h1 className="text-white text-lg font-semibold">
                    {movie._id}
                  </h1>
                </div>
                <div className="flex">
                  {movie.documents.map((document) => (
                    <>
                      <div
                        className="divCards mr-7 relative inline-block"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${document.image[0]})`,
                          backgroundSize: "cover",
                        }}
                      >
                        <div className="titleDiv text-white" onClick={(e)=>handleView(e,document.title)}>
                          <h1 className="text-center font-semibold">
                            {document.title}
                          </h1>
                          <h1 className="text-center font-semibold">
                            {document.description}
                          </h1>
                          <div className="flex justify-evenly font-semibold">
                            <h1>{document.duration}</h1>
                            <h1>{document.genre}</h1>
                          </div>
                          <div className="overlayDiv">
                            <div className="bg-slate-400 px-3 py-1 rounded-md hover:bg-slate-500">
                              <svg
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    handleClick(document.title)
                                }}
                                viewBox="0 0 1024 1024"
                                fill="currentColor"
                                height="3em"
                                width="2em"
                                {...props}
                              >
                                <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                              </svg>
                            </div>

                            <div className="bg-slate-400 px-3 py-1 rounded-md hover:bg-slate-500">
                              <svg onClick={(e)=>{
                                e.stopPropagation()
                                handleDelete(document.title)
                              }}
                                viewBox="0 0 1024 1024"
                                fill="currentColor"
                                height="3em"
                                width="2em"
                                {...props}
                              >
                                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <Modal
                          isOpen={modal}
                          onRequestClose={() => setModal(false)}
                          style={{
                            overlay: {
                              position: "fixed",
                              backgroundColor:'rgba(255, 255, 255, 0.3)',
                              
                            },
                            content: {
                              width: "550px",
                              left: "30%",
                              
                            },
                          }}
                        >
                          <div className="flex flex-col justify-center p-5">
                            <h1 className="text-center text-2xl font-semibold">
                              Edit Movie
                            </h1>
                            <form
                              onSubmit={(e)=>handleSubmit(e,document._id)}
                              enctype="multipart/form-data"
                            >
                              <div className="innerDiv">
                                <div className="inputFieldDiv">
                                  <label className="gapInput">
                                    Enter Title
                                  </label>
                                  <input
                                    className="border-2 w-48"
                                    type="text"
                                    placeholder="Enter Title"
                                    value={title}
                                    name="title"
                                    onChange={(e) => setTitle(e.target.value)}
                                  ></input>
                                </div>

                                <div className="inputFieldDiv">
                                  <label className="">Enter Description</label>
                                  <textarea
                                    className="w-48 border-2"
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    name="description"
                                  ></textarea>
                                </div>

                                <div className="inputFieldDiv">
                                  <label>Enter Duration</label>
                                  <input
                                    type="number"
                                    placeholder="Enter Duration"
                                    value={duration}
                                    onChange={(e) =>
                                      setDuration(e.target.value)
                                    }
                                    name="duration"
                                    className="border-2 w-48"
                                  ></input>
                                </div>

                                <div className="inputFieldDiv">
                                  <label>Enter Duration</label>
                                  <select
                                    className="border-2 w-48"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    name="genre"
                                  >
                                    <option>Select Genre</option>
                                    <option>Action</option>
                                    <option>Comedy</option>
                                    <option>Drama</option>
                                    <option>Fantasy</option>
                                    <option>Thriller</option>
                                    <option>Horror</option>
                                    <option>Mystery</option>
                                    <option>Romance</option>
                                  </select>
                                </div>

                                <div className="inputFieldDiv">
                                  <label className="">Select Image</label>
                                  <input
                                    className="w-48"
                                    type="file"
                                    name="image"
                                    onChange={(e) => setFile(e.target.files[0])}
                                  ></input>
                                </div>

                                <div className=" mt-10">
                                  <div className="flex justify-center">
                                    <button
                                      className="bg-slate-400 px-3 py-1 rounded-md hover:bg-slate-300 "
                                      type="submit"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                  <br />
                                  <div className="flex justify-center">
                                    <button
                                      className="bg-slate-400 px-3 py-1 rounded-md hover:bg-slate-300"
                                      onClick={() => setModal(false)}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Modal>

                        <Modal
                          isOpen={viewModal}
                          onRequestClose={() => setViewModal(false)}
                          style={{
                            overlay: {
                              position: "fixed",
                              backgroundColor:'rgba(255, 255, 255, 0.3)',
                              
                            },
                            content: {
                              width: "550px",
                              left: "30%",
                              
                            },
                          }}
                        >
                          <div className="flex flex-col justify-center p-5">
                            <h1 className="text-center text-2xl font-semibold">
                              View Movie
                            </h1>
                            
                              <div className="innerDiv">
                                <div className="inputFieldDiv">
                                  <label className="gapInput">
                                    Movie Title
                                  </label>
                                  <h1>{title}</h1>
                                </div>    

                                <div className="inputFieldDiv">
                                  <label className="gapInput">
                                    Description
                                  </label>

                                  <h1>{description}</h1>
                                </div>  

                                <div className="inputFieldDiv">
                                  <label className="gapInput">
                                    Duration
                                  </label>

                                  <h1>{duration}</h1>
                                </div>  

                                <div className="inputFieldDiv">
                                  <label className="gapInput">
                                    Genre
                                  </label>

                                  <h1>{genre}</h1>
                                </div>          

                                <div className=" mt-10">
                                  
                                  <br />
                                  <div className="flex justify-center">
                                    <button
                                      className="bg-slate-400 px-3 py-1 rounded-md hover:bg-slate-300"
                                      onClick={() => setViewModal(false)}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            
                          </div>
                        </Modal>
                      </div>
                    </>
                  ))}
                </div>
              </>
            ))}
        </div>
      ) : (
        <div className="w-full h-screen bg-slate-800 p-10">
          <div className="noMovies">
            <h1 className="text-3xl font-bold text-slate-400">No Movies</h1>
          </div>
        </div>
      )}
    </>
  );
}

export default Cards;
