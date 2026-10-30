import { useState } from 'react'
import { generateAudio } from '../../utils/generateUtils'

export default function useGeneratePage() {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [refText, setRefText] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [loadingStatus, setLoadingStatus] = useState<string>('')
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (uploadedAudioUrl) {
        URL.revokeObjectURL(uploadedAudioUrl)
      }
      setUploadedAudioUrl(URL.createObjectURL(file))
      setUploadedFileName(file.name)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setLoadingStatus('Initializing...')

    try {
      const audioUrl = await generateAudio({
        refText,
        text,
        uploadedAudioUrl,
        onProgress: (status) => setLoadingStatus(status),
      })

      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl)
      }

      setGeneratedAudioUrl(audioUrl)
    } catch (error) {
      console.error('Gagal generate audio:', error)
    } finally {
      setIsGenerating(false)
      setLoadingStatus('')
    }
  }

  return {
    uploadedAudioUrl,
    uploadedFileName,
    refText,
    setRefText,
    text,
    setText,
    isGenerating,
    loadingStatus,
    generatedAudioUrl,
    handleAudioUpload,
    handleGenerate,
  }
}