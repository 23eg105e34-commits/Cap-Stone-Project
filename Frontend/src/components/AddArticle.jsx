// rfce
import { useState } from 'react' 

import { useForm } from 'react-hook-form'

function AddArticle() {
    const [article,setArticle]=useState()
    const handleForm = (data) => {
        console.log(data)
        setArticle(data)
    }
    const {register,handleSubmit,formState:{errors}}=useForm()
     
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit(handleForm)}>
            <input type="text" placeholder="Title" 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("title", 
                { required: true, minLength: 4 })}/>
        {
            errors.title?.type=="required" && <p> Title required</p>
        }
        {
            errors.title?.type=="minLength" && <p> min length 4</p>
        }

        <select 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"

        {...register("category",{required:true})}>
            <option value=""> Select Category</option>
          <option value="technology">  Technology</option>
            <option value="sports"> Sports </option>
          <option value="health"> Health</option>
            <option value="education">  Education</option>
        </select>
        {
            errors.category && <p>Category required</p>
        }
        <textarea 
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Content" {...register("content",{required:true,minLength:10})}/>
        {
            errors.content?.type=="required" && <p> Content required </p>
        }
        {
            errors.content?.type=="minLength" && <p> Min length 10 </p>
        }

        <button 
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        type="submit">Submit</button>

        </form>
    </div>
  )
}

export default AddArticle