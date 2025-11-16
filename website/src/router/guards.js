export const adminGuard = (to, from, next) => {
  // Check authentication from localStorage
  const userStr = localStorage.getItem('user')
  const accessToken = localStorage.getItem('accessToken')
  
  if (!userStr || !accessToken) {
    next('/admin/login')
    return
  }
  
  try {
    const user = JSON.parse(userStr)
    const userRole = user?.role
    
    if (userRole !== 'ADMIN' && userRole !== 'COMPANY') {
      next('/admin/login')
      return
    }
    
    next()
  } catch (error) {
    // Invalid user data, redirect to login
    next('/admin/login')
  }
}

