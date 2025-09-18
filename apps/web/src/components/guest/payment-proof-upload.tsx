"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, Upload, RefreshCw } from "lucide-react"
import { FileDropzone } from "@/components/guest/file-dropzone"
import { ImagePreview } from "@/components/guest/image-preview"
import { usePaymentProofUpload } from "@/hooks/use-payment-proof-upload"
import { cn } from "@/lib/utils"
import type { BadgeVariant } from "@repo/types"

interface PaymentProof {
  id: string
  imageUrl: string
  uploadedAt: string
  acceptedAt?: string | null
  rejectedAt?: string | null
}

interface PaymentProofUploadProps {
  bookingId: string
  orderCode: string
  onUploadComplete?: () => void
  className?: string
  compact?: boolean // For table row integration
}

type ProofStatus =
  | { status: "accepted"; label: string; color: BadgeVariant }
  | { status: "pending"; label: string; color: BadgeVariant }
  | { status: "rejected"; label: string; color: BadgeVariant }
  | null

export function PaymentProofUpload({
  bookingId,
  orderCode,
  onUploadComplete,
  className,
  compact = false,
}: PaymentProofUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingProof, setExistingProof] = useState<PaymentProof | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { uploadPaymentProof, getPaymentProof, deletePaymentProof, uploading, uploadProgress, error } =
    usePaymentProofUpload({
      bookingId,
      onUploadComplete: () => {
        setSelectedFile(null)
        loadExistingProof()
        onUploadComplete?.()
      },
    })

  const loadExistingProof = useCallback(async () => {
    setIsLoading(true)
    try {
      const proof = await getPaymentProof()
      setExistingProof(proof)
    } catch (error) {
      console.error("Failed to load existing proof:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getPaymentProof])

  useEffect(() => {
    loadExistingProof()
  }, [bookingId, loadExistingProof])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    await uploadPaymentProof(selectedFile)
  }

  const handleRemoveSelected = () => {
    setSelectedFile(null)
  }

  const handleReplaceExisting = async () => {
    setExistingProof(null)
    await loadExistingProof()
  }

  const handleDeleteExisting = async () => {
    const success = await deletePaymentProof()
    if (success) {
      setExistingProof(null)
    }
  }

  const getProofStatus = (): ProofStatus => {
    if (!existingProof) return null

    if (existingProof.rejectedAt) {
      return { status: "rejected", label: "Rejected", color: "destructive" }
    }
    if (existingProof.acceptedAt) {
      return { status: "accepted", label: "Accepted", color: "default" }
    }
    return { status: "pending", label: "Under Review", color: "secondary" }
  }

  const proofStatus = getProofStatus()

  if (compact && !existingProof && !selectedFile) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          /* Open modal or expand */
        }}
        className="h-8 text-xs"
      >
        <Upload className="h-3 w-3 mr-1" />
        Upload Proof
      </Button>
    )
  }

  if (compact && existingProof) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={proofStatus?.color}>
          {proofStatus?.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
          {proofStatus?.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {proofStatus?.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
          {proofStatus?.label}
        </Badge>
        <Button variant="ghost" size="sm" onClick={handleReplaceExisting} className="h-6 w-6 p-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Proof - {orderCode}</span>
          {proofStatus && (
            <Badge variant={proofStatus.color}>
              {proofStatus.status === "accepted" && <CheckCircle className="h-4 w-4 mr-1" />}
              {proofStatus.status === "pending" && <Clock className="h-4 w-4 mr-1" />}
              {proofStatus.status === "rejected" && <AlertCircle className="h-4 w-4 mr-1" />}
              {proofStatus.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : existingProof ? (
          <div className="space-y-4">
            <ImagePreview
              imageUrl={existingProof.imageUrl}
              title={`Payment Proof - ${orderCode}`}
              onReplace={handleReplaceExisting}
              onRemove={handleDeleteExisting}
            />

            <div className="text-sm text-gray-600">
              <p>Uploaded: {new Date(existingProof.uploadedAt).toLocaleString()}</p>
              {existingProof.acceptedAt && (
                <p className="text-green-600">Accepted: {new Date(existingProof.acceptedAt).toLocaleString()}</p>
              )}
              {existingProof.rejectedAt && (
                <p className="text-red-600">Rejected: {new Date(existingProof.rejectedAt).toLocaleString()}</p>
              )}
            </div>

            {existingProof.rejectedAt && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Your payment proof was rejected. Please upload a new, clear image of your payment receipt or transfer
                  confirmation.
                </p>
              </div>
            )}
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <ImagePreview file={selectedFile} onRemove={handleRemoveSelected} onReplace={() => setSelectedFile(null)} />

            {uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Payment Proof
                </Button>
                <Button variant="outline" onClick={handleRemoveSelected} disabled={uploading}>
                  Cancel
                </Button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <FileDropzone onFileSelect={handleFileSelect} disabled={uploading} />

            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Payment Proof Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Upload a clear photo of your bank transfer receipt</li>
                <li>Make sure transaction details are visible</li>
                <li>Include date, amount, and reference number</li>
                <li>Accepted formats: JPEG, PNG (max 1MB)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
