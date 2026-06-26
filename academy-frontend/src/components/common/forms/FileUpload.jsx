"use client";

import { useRef } from "react";
import { Upload, File, X } from "lucide-react";

import FormLabel from "./FormLabel";
import FormHelperText from "./FormHelperText";
import FormError from "./FormError";

export default function FileUpload({
  id,
  name,
  label,

  value,
  onChange,

  accept = "*",

  required = false,
  disabled = false,

  helperText,
  error,

  className = "",
}) {
  const inputRef = useRef(null);

  const handleBrowse = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange?.(file);
  };

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";

    const sizes = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const i = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes /
      Math.pow(1024, i)
    ).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="w-full">
      {label && (
        <FormLabel
          htmlFor={id || name}
          required={required}
        >
          {label}
        </FormLabel>
      )}

      <input
        ref={inputRef}
        id={id || name}
        name={name}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      {!value ? (
        <div
          onClick={handleBrowse}
          className={`
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-lg
            border-2
            border-dashed
            border-gray-300
            bg-gray-50
            px-6
            py-10
            transition
            hover:border-blue-500
            hover:bg-blue-50

            ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : ""
            }

            ${className}
          `}
        >
          <Upload
            size={40}
            className="mb-3 text-gray-400"
          />

          <p className="text-sm font-medium">
            Click to upload
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {accept}
          </p>
        </div>
      ) : (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-gray-200
            bg-white
            p-4
          "
        >
          <div className="flex items-center gap-3">
            <File
              size={24}
              className="text-blue-600"
            />

            <div>
              <p className="font-medium text-gray-800">
                {value.name}
              </p>

              <p className="text-xs text-gray-500">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={removeFile}
              className="
                rounded-md
                p-2
                text-red-500
                transition
                hover:bg-red-50
              "
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      <FormHelperText>
        {helperText}
      </FormHelperText>

      <FormError
        error={error}
      />
    </div>
  );
}