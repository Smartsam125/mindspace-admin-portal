import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Pagination, Avatar } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtDate, labelify } from '../../shared/utils/format'

export default function ClientsPage() {
  const [page, setPage] = useState(0)
  const { mutate } = useMutation()

  const { data, loading, refetch } = useQuery(() => api.getClients(page, 15), [page])
  const rows = data?.content || []

  const handleToggle = async (c) => {
    await mutate(() => api.toggleUserActive(c.id))
    toast.success(`User ${c.active ? 'deactivated' : 'activated'}`)
    refetch()
  }

  const cols = ['Client', 'Phone', 'Gender', 'Location', 'Joined', 'Verified', 'Status', 'Actions']

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${data?.totalElements ?? '—'} registered`} />

      <Card noPad>
        <DataTable
          columns={cols}
          rows={rows}
          loading={loading}
          empty="No clients yet"
          renderRow={c => (<>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={c.fullName} src={c.profilePictureUrl} size={34}
                  bg="#f3e8ff" color="#7c3aed" />
                <div>
                  <p className="font-bold text-sm leading-tight" style={{ color: colors.dark }}>{c.fullName}</p>
                  <p className="text-xs" style={{ color: colors.muted }}>{c.email}</p>
                </div>
              </div>
            </Td>
            <Td muted>{c.phone || '—'}</Td>
            <Td><Badge status={c.gender} /></Td>
            <Td muted>{c.location || '—'}</Td>
            <Td mono muted nowrap>{fmtDate(c.createdAt)}</Td>
            <Td nowrap>
              <span className="text-base">{c.emailVerified ? '✓' : '✗'}</span>
            </Td>
            <Td nowrap><Badge status={c.active ? 'ACTIVE' : 'INACTIVE'} /></Td>
            <Td nowrap>
              <Btn variant={c.active ? 'danger' : 'secondary'} size="sm" onClick={() => handleToggle(c)}>
                {c.active ? 'Suspend' : 'Activate'}
              </Btn>
            </Td>
          </>)}
        />
        <Pagination page={page} totalPages={data?.totalPages} total={data?.totalElements} onChange={setPage} />
      </Card>
    </div>
  )
}
