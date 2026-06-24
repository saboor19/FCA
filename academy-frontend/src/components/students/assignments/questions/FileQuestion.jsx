"use client";

import { useState } from "react";

import { uploadFile }
from "@/services/fileService";

export default function FileQuestion({

  question,
  index,
  answers,
  setAnswers

}){

  const [uploading,setUploading] =
  useState(false);

  const currentAnswer =
  answers.find(
    answer =>
      answer.questionId ===
      question._id
  );

  const handleFileUpload =
  async(event)=>{

    try{

      const file =
      event.target.files[0];

      if(!file) return;

      setUploading(true);

      // FILE SIZE VALIDATION

      if(
        question.maxFileSize &&
        file.size >
        question.maxFileSize * 1024 * 1024
      ){

        alert(
          `Maximum file size is ${question.maxFileSize} MB`
        );

        return;

      }

      const formData =
      new FormData();

      formData.append(
        "file",
        file
      );

      const response =
      await uploadFile(
        formData
      );

      setAnswers(prev=>{

        const existing =
        prev.filter(
          answer =>
            answer.questionId !==
            question._id
        );

        return [

          ...existing,

          {
            questionId:
              question._id,

            uploadedFiles:[
              {
                fileId:
                  response.fileId,

                filename:
                  response.filename,

                contentType:
                  file.type
              }
            ]
          }

        ];

      });

    }
    catch(error){

      console.log(error);

      alert(
        "File upload failed"
      );

    }
    finally{

      setUploading(false);

    }

  };

  return(

    <div
      className="
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        p-5
      "
    >

      <h2
        className="
          text-base
          md:text-lg
          font-semibold
          text-slate-900
          dark:text-white
        "
      >
        Q{index + 1}.{" "}
        {question.question}
      </h2>

      <div className="mt-5">

        <input
          type="file"
          id={`file-${question._id}`}
          className="hidden"
          onChange={handleFileUpload}
        />

        <label
          htmlFor={`file-${question._id}`}
          className="
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-300
            p-8
            text-center
            hover:bg-slate-50
            dark:hover:bg-slate-800
          "
        >

          <span
            className="
              text-sm
              font-medium
            "
          >
            {
              uploading
              ?
              "Uploading..."
              :
              "Click to Upload File"
            }
          </span>

          {
            question.allowedFileTypes && (
              <span
                className="
                  mt-2
                  text-xs
                  text-slate-500
                "
              >
                Allowed:
                {" "}
                {question.allowedFileTypes}
              </span>
            )
          }

          {
            question.maxFileSize && (
              <span
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Max Size:
                {" "}
                {question.maxFileSize}
                MB
              </span>
            )
          }

        </label>

        {
          currentAnswer?.uploadedFiles?.[0] && (

            <div
              className="
                mt-3
                rounded-xl
                border
                border-green-200
                bg-green-50
                p-3
                text-sm
                text-green-700
              "
            >

              Uploaded:

              {" "}

              {
                currentAnswer
                .uploadedFiles[0]
                .filename
              }

            </div>

          )
        }

      </div>

    </div>

  );

}