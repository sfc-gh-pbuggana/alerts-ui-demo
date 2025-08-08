"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function NoResultsCard() {
  return (
    <div className="p-6">
      <Card className="bg-[var(--panel-2)] border-[var(--border)] text-[var(--text)]">
        <CardHeader>
          <CardTitle className="text-base">Query Results</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--subtle-text)]">
          No query has been run yet
        </CardContent>
      </Card>
    </div>
  )
}

export function QueryResults() {
  return (
    <div className="p-6">
      <Card className="bg-[var(--panel-2)] border-[var(--border)] text-[var(--text)]">
        <CardHeader>
          <CardTitle className="text-base">Query Results</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">date</TableHead>
                <TableHead>amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2025-07-17</TableCell>
                <TableCell>4000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
