import React from 'react'
import { useAuth } from '../store/authStore'
import { Navigate } from 'react-router'

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth()

  // Show loading while checking auth
  if (loading) return <p>Loading...</p>

  // Not logged in → redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Role-based protection
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // If role is not allowed, redirect (you can use /unauthorized if you have a page)
    return <Navigate to="/unauthorized" replace />
  }
  // Authenticated and role allowed → render children
  return children
}

export default ProtectedRoute