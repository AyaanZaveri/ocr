import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function App() {
  const [text, setText] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [progress, setProgress] = useState<string>('')

  const worker = createWorker({
    logger: (logs) => setProgress(logs.status == "recognizing text" ? logs.progress*100 + '%' : ''),
  })

  const getOCRData = async (img: string) => {
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

  return (
    <div className="mt-3 grid place-items-center">
      <div className="flex w-full justify-center gap-3">
        <input
          type="text"
          className="w-3/12 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-100"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
        />
        <button onClick={() => getOCRData(url)}>Run OCR</button>
      </div>
      {image ? (
        <img src={image} alt="" className="w-96" onError={() => setImage('')} />
      ) : null}
      <div className="h-2.5 w-3/12 mt-3 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full bg-blue-600"
          style={{ width: progress }}
        ></div>
      </div>
      <h3>{text}</h3>
    </div>
  )
}
