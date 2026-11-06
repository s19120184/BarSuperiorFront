

type Props ={
    title:string,
    description:string
}

export default function GlobalHeaders({title, description}:Props) {
  return (
      <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {description}
          </p>
        </div>
  )
}
