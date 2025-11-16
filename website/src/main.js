import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Tariff from './pages/Tariff.vue'
import Contact from './pages/Contact.vue'
import BookRide from './pages/BookRide.vue'
import TourPackages from './pages/TourPackages.vue'
import Enquiry from './pages/Enquiry.vue'
import AdminLogin from './pages/AdminLogin.vue'
import CompanyLogin from './pages/CompanyLogin.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import RegisterCompany from './pages/RegisterCompany.vue'
import CompaniesList from './pages/CompaniesList.vue'
import CreateCompany from './pages/CreateCompany.vue'
import CompanyDetails from './pages/CompanyDetails.vue'
import DriversList from './pages/DriversList.vue'
import PassengersList from './pages/PassengersList.vue'
import TripsList from './pages/TripsList.vue'
import DriverForm from './components/DriverForm.vue'
import DriverDetails from './pages/DriverDetails.vue'
import PaymentsList from './pages/PaymentsList.vue'
import PaymentDetails from './pages/PaymentDetails.vue'
import PassengerForm from './components/PassengerForm.vue'
import PassengerDetails from './pages/PassengerDetails.vue'
import EditTrip from './pages/EditTrip.vue'
import CreateTrip from './pages/CreateTrip.vue'
import VehiclesList from './pages/VehiclesList.vue'
import CreateVehicle from './pages/CreateVehicle.vue'
import EditVehicle from './pages/EditVehicle.vue'
import Collections from './pages/Collections.vue'

import { adminGuard } from './router/guards'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/tariff', name: 'Tariff', component: Tariff },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/book', name: 'BookRide', component: BookRide },
  { path: '/tours', name: 'TourPackages', component: TourPackages },
  { path: '/enquiry', name: 'Enquiry', component: Enquiry },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/company/login', name: 'CompanyLogin', component: CompanyLogin },
  { path: '/admin/register-company', name: 'RegisterCompany', component: RegisterCompany },
  { 
    path: '/admin/dashboard', 
    name: 'AdminDashboard', 
    component: AdminDashboard,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/companies', 
    name: 'CompaniesList', 
    component: CompaniesList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/companies/create', 
    name: 'CreateCompany', 
    component: CreateCompany,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/companies/:id', 
    name: 'CompanyDetails', 
    component: CompanyDetails,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/drivers', 
    name: 'DriversList', 
    component: DriversList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/passengers', 
    name: 'PassengersList', 
    component: PassengersList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/trips', 
    name: 'TripsList', 
    component: TripsList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/trips/create', 
    name: 'CreateTrip', 
    component: CreateTrip,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/trips/:id', 
    name: 'EditTrip', 
    component: EditTrip,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/vehicles', 
    name: 'VehiclesList', 
    component: VehiclesList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/vehicles/create', 
    name: 'CreateVehicle', 
    component: CreateVehicle,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/vehicles/:id', 
    name: 'EditVehicle', 
    component: EditVehicle,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/drivers/create', 
    name: 'CreateDriver', 
    component: DriverForm,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/drivers/:id', 
    name: 'DriverDetails', 
    component: DriverDetails,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/drivers/:id/edit', 
    name: 'EditDriver', 
    component: DriverForm,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/payments', 
    name: 'PaymentsList', 
    component: PaymentsList,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/payments/:id', 
    name: 'PaymentDetails', 
    component: PaymentDetails,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/passengers/create', 
    name: 'CreatePassenger', 
    component: PassengerForm,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/passengers/:id', 
    name: 'PassengerDetails', 
    component: PassengerDetails,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/passengers/:id/edit', 
    name: 'EditPassenger', 
    component: PassengerForm,
    beforeEnter: adminGuard,
  },
  { 
    path: '/admin/collections', 
    name: 'Collections', 
    component: Collections,
    beforeEnter: adminGuard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
