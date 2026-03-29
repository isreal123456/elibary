function ResultsTable({ rows }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Assessment Results</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-2 pr-4 font-medium">Student</th>
              <th className="py-2 pr-4 font-medium">Assessment</th>
              <th className="py-2 pr-4 font-medium">Score</th>
              <th className="py-2 pr-4 font-medium">Percentage</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-900">{row.studentName}</td>
                  <td className="py-2 pr-4 text-slate-600">{row.assessmentTitle}</td>
                  <td className="py-2 pr-4 text-slate-600">
                    {row.score}/{row.total}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{row.percentage}%</td>
                  <td className="py-2 text-slate-600">{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-slate-500">
                  No results available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsTable
