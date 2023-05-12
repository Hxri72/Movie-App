import React, { useState } from "react";
import "../stylesheets/header.css";
import "../stylesheets/modal.css";
import Modal from "react-modal";
import { getAlldocuments, postData } from "../axios/axios";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

function Header() {
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    const data = {
      title: title,
      description: description,
      duration: duration,
      genre: genre,
    };

    const response = await postData(formData, data);
    if (response.success) {
      toast.success(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }else{
      toast.error(response.message)
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    const response = await getAlldocuments();
    setSuggestions(response.data);
  };

  return (
    <>
      <div className="mainDivHeader">
        <div className="appLogo">
          <h1 className="text-xl font-semibold text-white ">Movie App</h1>
        </div>

        <div className="headerFunctionMainDiv">
          <div className="mr-10">
            <input
              className="w-72  h-8 border-none pl-3 rounded-md"
              type="text"
              placeholder="Search Movie"
              autocomplete="off"
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
            ></input>
            {inputValue && 
            <div >
              {suggestions
                .filter((item) => {
                  const searchTerm = inputValue.toLowerCase();
                  const title = item.title.toLowerCase();

                  return (
                    searchTerm &&
                    title.startsWith(searchTerm) &&
                    title !== searchTerm
                  );
                })
                .slice(0, 2)
                .map((suggestion) => (
                  <div key={suggestion.title} className='bg-white'>
                    {suggestion.title}
                  </div>
                ))}
            </div>
            }
          </div>
          <div>
            <button
              className="border-2 text-white text-sm py-1 px-2 rounded-md"
              onClick={() => setModal(true)}
            >
              Add Movie
            </button>
          </div>
        </div>
        <Modal
          isOpen={modal}
          onRequestClose={() => setModal(false)}
          style={{
            overlay: {
              position: "fixed",
              backgroundColor:'rgba(255, 255, 255, 0.3)'
            },
            content: {
              width: "550px",
              left: "30%",
            },
          }}
        >
          <div className="flex flex-col justify-center p-5">
            <h1 className="text-center text-2xl font-semibold">Add Movie</h1>
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
              <div className="innerDiv">
                <div className="inputFieldDiv">
                  <label className="gapInput">Enter Title</label>
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
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                  ></textarea>
                </div>

                <div className="inputFieldDiv">
                  <label>Enter Duration</label>
                  <input
                    type="number"
                    placeholder="Enter Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
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
      </div>
    </>
  );
}

export default Header;
