// import { useContext} from "react"
// import { AuthContext } from "../Contexts/AuthContext"
// import { Navigate } from "react-router-dom"

// const PrivateRoute = ({ children, role }) => {

//     const { authenticated, loading, permissions } = useContext(AuthContext)

//     if (!authenticated) {
//         return <Navigate to="/" />
//     }

//     if (!role && authenticated) {
//         return children
//     }

//     if (loading) {
//         return <div className='loading'>Carregando...</div>
//     }

//     return permissions === 'Administrador' ? children : null
// }

// export default PrivateRoute