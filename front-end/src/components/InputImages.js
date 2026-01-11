import React, {Fragment, useState} from "react";

const InputImage = () => {
  //state variables that store user inputted state in text boxes for uploaded file and comment
  //set state used to update state
  const [selectedFile, setSelectedFile] = useState(null);
  const [userComment, setUserComment] = useState('');

  //updates state when user uploads file
  const handleFileChange = (e) => {
    console.log('updating file state');
    setSelectedFile(e.target.files[0]);
  };

  //uploads state when user adds comment
  const handleCommentChange = (e) => {
    console.log('updating comment state');
    setUserComment(e.target.value);
  };

//submit form when done
  const handleSubmit = async (e) => 
    {
        e.preventDefault();

        //need to have file to submit
        if (!selectedFile) {
        alert('Please select a file');
        return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('comment', userComment);

        try {
          const response = await fetch("/api/images", {
            method: "POST",
            body: formData
          });

          if (!response.ok) throw new Error("Upload failed");

          window.location = "/";
          
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <input type="text" 
                    value={userComment} 
                    onChange={handleCommentChange} 
                    placeholder="Comment" />
            <button type="submit">Upload</button>
        </form>

        <table>
            <tbody>
            </tbody>
        </table>
        </Fragment>
    );
};

export default InputImage;