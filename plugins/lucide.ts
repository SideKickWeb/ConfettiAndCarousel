import { defineNuxtPlugin } from '#app'
import {
  PhoneCall,
  Mail,
  MapPin,
  Building2,
  CalendarClock,
  CalendarCheck,
  CalendarHeart,
  Instagram,
  Facebook,
  Heart,
  Copyright
} from 'lucide-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  // Register specific icons we need
  nuxtApp.vueApp.component('LucidePhoneCall', PhoneCall)
  nuxtApp.vueApp.component('LucideMail', Mail)
  nuxtApp.vueApp.component('LucideMapPin', MapPin)
  nuxtApp.vueApp.component('LucideBuilding2', Building2)
  nuxtApp.vueApp.component('LucideCalendarClock', CalendarClock)
  nuxtApp.vueApp.component('LucideCalendarCheck', CalendarCheck)
  nuxtApp.vueApp.component('LucideCalendarHeart', CalendarHeart)
  nuxtApp.vueApp.component('LucideInstagram', Instagram)
  nuxtApp.vueApp.component('LucideFacebook', Facebook)
  nuxtApp.vueApp.component('LucideHeart', Heart)
  nuxtApp.vueApp.component('LucideCopyright', Copyright)
}) 