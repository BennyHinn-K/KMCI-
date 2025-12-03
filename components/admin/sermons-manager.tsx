"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Play } from "lucide-react";
import { format } from "date-fns";
import { SermonDialog } from "./sermon-dialog";

interface SermonsManagerProps {
  sermons: any[];
}

export function SermonsManager({
  sermons: initialSermons,
}: SermonsManagerProps) {
  const [sermons, setSermons] = useState(initialSermons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<any>(null);

  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sermons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingSermon(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Sermon
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Scripture</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSermons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No sermons found
                </TableCell>
              </TableRow>
            ) : (
              filteredSermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">{sermon.title}</TableCell>
                  <TableCell>{sermon.speaker}</TableCell>
                  <TableCell>
                    {format(new Date(sermon.sermon_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{sermon.scripture_reference || "—"}</TableCell>
                  <TableCell>{sermon.views}</TableCell>
                  <TableCell>
                    <Badge
                      variant={sermon.is_featured ? "default" : "secondary"}
                    >
                      {sermon.is_featured ? "Featured" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSermon(sermon);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SermonDialog
        sermon={editingSermon}
        open={isDialogOpen}
        onOpenChangeAction={setIsDialogOpen}
        onSaveAction={() => {
          setIsDialogOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
