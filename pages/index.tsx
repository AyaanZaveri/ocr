import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function App() {
  const [text, setText] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  const worker = createWorker({
    logger: (logs) =>
      setProgress(logs.status == 'recognizing text' ? logs.progress * 100 : 0),
  })

  const getOCRData = async (img: string) => {
    setText('')
    try {
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
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
    if (progress <= 10) {
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
      <div className="flex w-6/12 flex-col justify-center gap-3">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-100"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL of an image"
          />
          <button
            className="w-3/12 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-100"
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
              <p className="mt-2 text-slate-800 w-full border h-auto p-2 rounded shadow-sm">{text}</p>
            </div>
          </div>
        ) : null}
      </div>
      {/* {image ? (
        <img src={image} alt="" className="w-96" onError={() => setImage('')} />
      ) : null} */}
    </div>
  )
}
