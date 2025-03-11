import { useState, useRef, useEffect } from "react";

type inputType = "text" | "password" | "email";
type name = "username" | "email" | "password" | "conPassword" | "displayname" | "bio" | "website";

interface InputTextProps {
  title: string;
  maxLength?: number;
  inputType: inputType;
  name: name;
  value: string;
  error: string | false | undefined;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputTextProps) => {
  const [focus, setFocus] = useState(false);
  const [length, setLength] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    setFocus(true);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFocus(false);
    props.onBlur(e);
  }

  useEffect(() => {
    setLength(props.value.length);
  }, [props.value]);

  function handleClick() {
    inputRef.current?.focus();
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={` ${
          props.error
            ? "ring-red-800"
            : focus
            ? "ring-blue-400"
            : "ring-slate-400"
        } w-full h-[55px] mt-5 ring-1 px-2 py-1 rounded-sm `}
      >
        <div className="flex justify-between   text-slate-400">
          <p
            className={`transition-all duration-75 ease-out ${
              props.error
                ? "text-red-800"
                : focus
                ? "text-blue-400"
                : "text-slate-400"
            } ${
              !focus && length === 0 ? "text-md mt-[10px] absolute" : "text-sm "
            } `}
          >
            {props.title}
          </p>
          {props.maxLength && (
            <p className={`${focus ? "" : "hidden"} text-sm`}>
              {length} / {props.maxLength}
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          onChange={props.onChange}
          name={props.name}
          value={props.value}
          maxLength={props.maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={` w-full  h-auto focus:outline-0  bg-transparent text-white`}
          type={props.inputType}
        />
      </div>
      {props.error && <p className="text-red-600 text-sm">{props.error}</p>}
    </>
  );
};
