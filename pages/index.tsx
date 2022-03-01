import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'
import { ClipboardIcon } from '@heroicons/react/outline'

export default function App() {
  const [text, setText] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  const handleChange = (event: any) => {
    setImage(URL.createObjectURL(event.target.files[0]))
    setUrl(URL.createObjectURL(event.target.files[0]))
  }

  const worker = createWorker({
    logger: (logs) =>
      setProgress(logs.status == 'recognizing text' ? logs.progress * 100 : 0),
  })

  const getOCRData = async (img: string) => {
    setText('')
    try {
      await worker.load()
      await worker.loadLanguage('fra')
      await worker.initialize('fra')
      const {
        data: { text },
      } = await worker.recognize(img)
      console.log(text)
      setText(text)
      await worker.terminate()
      setImage(url)
    } catch (error) {
      console.log(error, 'Invalid Image')
    }
  }

  // https://tesseract.projectnaptha.com/img/eng_bw.png

  const checkProgress = () => {
    if (progress == 0) {
      return 'Starting...'
    } else if (progress <= 10) {
      return 'Just Started...'
    } else if (progress <= 80) {
      return 'Almost there...'
    } else if (progress <= 90) {
      return 'So close...'
    } else if (progress == 100) {
      return 'Done!'
    } else {
      return 'Processing...'
    }
  }

  return (
    <div className="mt-3 grid place-items-center gap-2">
      <div className="flex w-7/12 flex-col justify-center gap-3">
        <div className="flex flex-row gap-2">
        <input
            type="file"
            onChange={handleChange}
          />
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-emerald-500 focus:outline-none focus:ring focus:ring-emerald-200 active:bg-emerald-100"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL of an image"
          />
          <button
            className="w-2/12 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-emerald-500 focus:outline-none focus:ring focus:ring-emerald-200 active:bg-emerald-100"
            onClick={() => getOCRData(url)}
          >
            Run OCR
          </button>
        </div>
        {progress ? (
          <div>
            <span className="font-medium text-slate-800 drop-shadow-sm">
              {checkProgress()}
            </span>
            <div className="mt-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r shadow ${
                  progress !== 100
                    ? 'from-blue-500 to-sky-500'
                    : 'from-green-500 to-emerald-500'
                } transition-all duration-500 ease-linear`}
                style={{ width: progress + '%' }}
              ></div>
              <span className="text-sm text-slate-500 drop-shadow-sm">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        ) : null}
        {progress == 100 ? (
          <div className="mt-5 flex flex-wrap h-full w-full flex-row items-center gap-3 ">
            {image ? (
              <img
                src={image}
                alt=""
                className="rounded-md border p-2 shadow-sm"
                onError={() => setImage('')}
              />
            ) : null}
            <div className="inline-flex h-full w-full items-start gap-2">
              <textarea
                className="h-40 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-emerald-500 focus:outline-none focus:ring focus:ring-emerald-200 active:bg-emerald-100"
                value={text}
              >
                {text}
              </textarea>
              <button className="rounded-md border border-slate-200 bg-white px-2 py-2 text-slate-600 shadow-sm transition hover:cursor-pointer hover:bg-slate-50 focus:border-emerald-500 focus:outline-none focus:ring focus:ring-emerald-200 active:bg-emerald-100">
                <ClipboardIcon
                  className="h-5 w-5 text-slate-500"
                  onClick={() => {
                    navigator.clipboard.writeText(text)
                  }}
                />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
