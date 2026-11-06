

interface Props {
    msg:string
}

export default function Loader({msg}:Props) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400">
            {msg}
          </p>
        </div>
      </div>
  )
}
