import { useRouteError } from 'react-router'
function ErrorBoundary() {
    const {data,status,statusTesxt}=useRouteError()
  return (
    <div>
        <p>{data}</p>
        <P>
            {status}-{statusTesxt}
        </P>
    </div>
  )
}

export default ErrorBoundary
