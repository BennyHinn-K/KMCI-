"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, User } from "lucide-react"

interface SermonModalProps {
  sermon: {
    id: string
    title: string
    speaker: string
    date: string
    description: string
    scripture: string
    tags: string[]
    videoUrl: string
    audioUrl: string
    studyGuideUrl: string
  }
  isOpen: boolean
  onClose: () => void
}

export function SermonModal({ sermon, isOpen, onClose }: SermonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif pr-8">{sermon.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <p className="text-primary-foreground">Video Player (Integration Required)</p>
          </div>

          {/* Sermon Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{sermon.speaker}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{sermon.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{sermon.scripture}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{sermon.description}</p>

            <div className="flex flex-wrap gap-2">
              {sermon.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Download Options */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Audio
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
            <Button variant="outline" className="bg-transparent">
              <FileText className="w-4 h-4 mr-2" />
              Study Guide
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
