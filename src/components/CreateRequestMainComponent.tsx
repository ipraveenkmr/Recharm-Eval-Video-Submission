'use client'
import React, { useEffect, useState } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import { HiPlus, HiX } from "react-icons/hi";
import { IoAdd } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
  urls: string[];
}

const schema = yup.object().shape({
  urls: yup.array().of(
    yup
      .string()
      .required("URL is required.")
      .matches(
        /^https?:\/\/drive\.google\.com\/.+$/,
        "URL must be in the form of http://drive.google.com/some-link"
      )
  ),
});


export function CreateRequestMainComponent() {
  const initialUrls = ["http://drive.google.com/some-link"];

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      urls: initialUrls,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-nocheck
    name: "urls",
  });

  const [hideAddUrlBtn, setHideAddUrlBtn] = useState(false);

  useEffect(() => {
    setHideAddUrlBtn(fields.length >= 10);
  }, [fields])


  const onSubmit = (data: FormData) => {
    const result = data.urls.map((url: string) => {

      const value = url.substring(url.lastIndexOf('/') + 1);
      return {
        url: url,
        value: value
      };
    });


    alert(JSON.stringify(result, null, 2));
  };

  const handleAddUrl = async () => {
    const isValid = await trigger("urls");

    if (isValid) {
      append("");
    }
  };


  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>


        <div className="flex items-center justify-between p-2 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white py-2">
            Create New Request
          </h3>
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center min-h-[85vh]">
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Add videos or folders
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-400">
                These videos would be cut, labeled and made available in your
                Recharm video library
              </p>
            </div>



            <div>
              <div className="flex max-w-md flex-col gap-4">
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <div className="flex max-w-md flex-col gap-4">
                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor={`url${index}`}
                            color={errors.urls?.[index] ? "failure" : "default"}
                            value={`Video/Folder URL ${index + 1}`}
                          />
                        </div>
                        <div className="flex">
                          <TextInput
                            id={`url${index}`}
                            placeholder="http://drive.google.com/some-link"
                            {...register(`urls.${index}`)}
                            color={errors.urls?.[index] ? "failure" : "default"}
                            className="w-full"
                          />
                          <GoTrash
                            className="text-gray-600 cursor-pointer mt-3 -ml-7 z-10"
                            onClick={() => remove(index)}
                          />
                        </div>
                        <div>
                          {errors.urls?.[index] && <p className="text-[#C81E1E] text-sm mt-1">{errors.urls[index]?.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!hideAddUrlBtn && (
              <div>
                <Button
                  type="button"
                  color="light"
                  onClick={handleAddUrl}
                  className="text-sm font-medium hover:text-purple-800 bg-white hover:bg-gray-50 border border-gray-300"
                >
                  <span className="flex items-center">
                    <span className="bg-purple-800 rounded-full p-0.5 mr-2">
                      <HiPlus className="h-3 w-3 text-white" />
                    </span>
                    Add URL
                  </span>
                </Button>
              </div>
            )}

          </div>
        </div>


        <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
          <Button
            type="submit"
            color="primary"
            className="text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white"
          >
            <span>
              <IoAdd className="text-xl text-white mr-1" />
            </span>
            Create Request
          </Button>
        </div>

      </form >
    </div >
  );
}
