import { forwardRef, useEffect, useMemo, useRef, useState } from "react"

import { EmptyStateInline } from "@/components/empty-state/empty-state"
import { ErrorState } from "@/components/error-state/error-state"
import { LoadingState } from "@/components/loading-state/loading-state"
import type { AnySchema } from "@orama/orama"
import {
  type RowSelectionState,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { PinoramaIntrospection } from "pinorama-types"
import { useIntl } from "react-intl"
import type { SearchFilters } from "../log-filters/types"
import { LogViewerHeader } from "./components/header/header"
import { TableBody } from "./components/tbody"
import { TableHead } from "./components/thead"
import { useLiveLogs } from "./hooks/use-live-logs"
import { useStaticLogs } from "./hooks/use-static-logs"
import * as utils from "./utils"

type LogViewerProps = {
  introspection: PinoramaIntrospection<AnySchema>
  filters: SearchFilters
  searchText: string
  liveMode: boolean
  onSearchTextChange: (searchText: string) => void
  onSelectedRowChange: (row: any) => void
  onToggleFiltersButtonClick: () => void
  onClearFiltersButtonClick: () => void
  onToggleLiveButtonClick: (live: boolean) => void
}

export const LogViewer = forwardRef(function LogViewer(props: LogViewerProps) {
  const intl = useIntl()

  const staticLogsQuery = useStaticLogs(
    props.searchText,
    props.filters,
    !props.liveMode
  )

  const liveLogsQuery = useLiveLogs(
    props.searchText,
    props.filters,
    props.liveMode
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const tableContainerRef = useRef(null)

  const logsQuery = props.liveMode ? liveLogsQuery : staticLogsQuery
  const logs = useMemo(() => logsQuery.data ?? [], [logsQuery.data])

  const columnsConfig = useMemo(
    () => utils.getColumnsConfig(props.introspection),
    [props.introspection]
  )

  const table = useReactTable({
    data: logs,
    columns: columnsConfig.definition,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection
    },
    initialState: {
      columnVisibility: columnsConfig.visibility,
      columnSizing: columnsConfig.sizing
    }
  })

  const hasFilters =
    props.searchText.length > 0 && Object.keys(props.filters).length > 0

  // biome-ignore lint: I need to update the selected row on row selection change
  useEffect(() => {
    const rowModel = table.getSelectedRowModel()
    const original = rowModel.rows[0]?.original
    props.onSelectedRowChange(original)
  }, [table.getSelectedRowModel()])

  // biome-ignore lint: I need to reset row selection on filters change
  useEffect(() => {
    table.setRowSelection({})
  }, [props.filters, props.searchText])

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 24,
    overscan: 100
  })

  const isLoading = logsQuery.status === "pending"
  const hasError = logsQuery.status === "error"
  const hasNoData = logsQuery.data?.length === 0 || false

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <LogViewerHeader
        introspection={props.introspection}
        table={table}
        searchText={props.searchText}
        liveMode={props.liveMode}
        showClearFiltersButton={hasFilters}
        isLoading={logsQuery.isFetching}
        onSearchTextChange={props.onSearchTextChange}
        onToggleFiltersButtonClick={props.onToggleFiltersButtonClick}
        onToggleLiveButtonClick={props.onToggleLiveButtonClick}
        onClearFiltersButtonClick={props.onClearFiltersButtonClick}
        onRefreshButtonClick={logsQuery.refetch}
      />

      <div
        className="h-full overflow-auto relative w-full"
        ref={tableContainerRef}
      >
        <table className="text-sm w-full">
          <TableHead table={table} />
          {isLoading || hasNoData || hasError ? (
            <tbody className="relative">
              <tr>
                <td className="text-muted-foreground">
                  {isLoading ? (
                    <LoadingState />
                  ) : hasError ? (
                    <ErrorState error={logsQuery.error} />
                  ) : hasNoData ? (
                    <EmptyStateInline
                      message={intl.formatMessage({
                        id: "logExplorer.noLogsFound"
                      })}
                    />
                  ) : null}
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody virtualizer={virtualizer} rows={rows} />
          )}
        </table>
      </div>
    </div>
  )
})
