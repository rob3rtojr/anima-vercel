import React from "react";
import InputMask from 'react-input-mask';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: string;
  children?: React.ReactNode;
  mask?: string;
}

const TextBox = React.forwardRef<HTMLInputElement, IProps>(
  ({ className, children, labelText, type = "text", error, ...props }, ref) => {
    return (
      <div className={className + " relative"}>
        {labelText && (
          <label
            className="block text-gray-600  mb-2 text-xs lg:text-sm xl:text-base"
            htmlFor="txt"
          >
            {labelText}
          </label>
        )}
        <div className="flex items-stretch">
          {props.mask === "" &&
            <input
              id="txt"
              autoComplete="off"
              className={`border  disabled:border-slate-100 w-full block outline-none py-2 px-1 transition-all text-xs lg:text-sm xl:text-base  bg-slate-50 focus:shadow focus:shadow-blue-500
                ${error!=="" ? "border-red-500 border animate-shake" : "border-slate-400"} ${
                children ? "rounded-r-md" : "rounded-md"
              }`}
              {...props}
              ref={ref}
              type={type}
            />
          }
          {props.mask !== "" &&
            <InputMask
              id="txt"
              mask={props.mask ?? ''}
              autoComplete="off"
              className={`border  disabled:border-slate-100 w-full block outline-none py-2 px-1 transition-all text-xs lg:text-sm xl:text-base  bg-slate-50 focus:shadow focus:shadow-blue-500
                ${error!=="" ? "border-red-500 border animate-shake" : "border-slate-400"} ${
                children ? "rounded-r-md" : "rounded-md"
              }`}
              {...props}
              type={type}
              />
          }

          <div className="flex">{children}</div>
        </div>
        {error && (
          <p className="text-red-600 text-center animate-shake">{error}</p>
        )}
      </div>
    );
  }
);

TextBox.displayName = "TextBox";
export default TextBox;