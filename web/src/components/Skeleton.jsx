export function DashboardSkeleton() {
  return (
    <div className="skeleton-wrap">
      <div className="stat-row">
        <div className="stat-tile skeleton-tile" />
        <div className="stat-tile skeleton-tile" />
      </div>
      <div className="person-group">
        <div className="person-group-header">
          <span className="skeleton skeleton-text" style={{ width: '38%' }} />
          <span className="skeleton skeleton-text" style={{ width: '28%' }} />
        </div>
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  )
}

export function HistorySkeleton() {
  return (
    <div className="history-list skeleton-wrap">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="debt-row skeleton-row">
      <div className="debt-row-main">
        <span className="skeleton skeleton-dot" />
        <div className="debt-row-text">
          <span className="skeleton skeleton-text" style={{ width: 90 }} />
          <span className="skeleton skeleton-text" style={{ width: 120, marginTop: 6 }} />
        </div>
      </div>
      <span className="skeleton skeleton-text" style={{ width: 60 }} />
    </div>
  )
}
