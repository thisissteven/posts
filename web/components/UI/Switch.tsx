import React from 'react'

export function Switch({
  checked,
  ...rest
}: React.ComponentPropsWithoutRef<'input'>) {
  return (
    <div className="relative w-[30px] h-[20px]">
      <input
        type="checkbox"
        checked={checked}
        className="peer absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed"
        {...rest}
      />

      <div className="peer-checked:bg-blue w-full h-full rounded-full bg-span pointer-events-none peer-disabled:opacity-60"></div>
      <div
        className="transform peer-disabled:opacity-60 peer-checked:translate-x-[10px]
				absolute top-[3px] left-[3px] bg-white w-[14px] h-[14px] rounded-full duration-200 ease-in-out pointer-events-none"
      ></div>
    </div>
  )
}
