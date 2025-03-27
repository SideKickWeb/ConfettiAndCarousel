<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Contact Us</h4>
        <p class="contact-item">
          <PhoneCall class="icon" :size="20" />
          (555) 123-4567
        </p>
        <p class="contact-item">
          <Mail class="icon" :size="20" />
          info@confettiandcarousel.com
        </p>
        <p class="contact-item">
          <MapPin class="icon" :size="20" />
          123 Luxury Lane, Suite 100
        </p>
        <p class="contact-item location-detail">
          <Building2 class="icon" :size="20" />
          City, State 12345
        </p>
      </div>
      <div class="footer-section">
        <h4>Opening Hours</h4>
        <p class="contact-item">
          <CalendarClock class="icon" :size="20" />
          Monday - Friday: 9:00 AM - 6:00 PM
        </p>
        <p class="contact-item">
          <CalendarCheck class="icon" :size="20" />
          Saturday: 10:00 AM - 4:00 PM
        </p>
        <p class="contact-item">
          <CalendarHeart class="icon" :size="20" />
          Sunday: By Appointment
        </p>
      </div>
      <div class="footer-section">
        <h4>Follow Us</h4>
        <div class="social-links">
          <a href="https://www.instagram.com/confettiandcarousel/" target="_blank" class="social-link">
            <Instagram class="social-icon" :size="24" />
            <span>Instagram</span>
          </a>
          <a href="#" target="_blank" class="social-link">
            <Facebook class="social-icon" :size="24" />
            <span>Facebook</span>
          </a>
          <a href="#" target="_blank" class="social-link">
            <Music2 class="social-icon" :size="24" />
            <span>Tik Tok</span>
          </a>
        </div>
      </div>
    </div>
    <p class="copyright">
      <Copyright class="icon" :size="16" />
      {{ currentYear }} Confetti & Carousel. All rights reserved.
    </p>
  </footer>
</template>

<script setup>
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
  Copyright, 
  Music2
} from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #8b7355, #6b5b45);
  color: #fff6e6;
  padding: 2rem 2rem 1rem;
  margin-top: 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section h4 {
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.location-detail {
  margin-left: 1.75rem;
  margin-top: -0.5rem;
}

.icon {
  color: var(--accent-primary);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff6e6;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.social-link:hover {
  color: var(--accent-primary);
  transform: translateX(5px);
}

.social-icon {
  transition: transform 0.3s ease;
}

.social-link:hover .social-icon {
  transform: scale(1.1);
  color: var(--accent-primary);
}

.copyright {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #9c8a6e;
  color: #fff6e6;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }

  .contact-item {
    justify-content: center;
  }

  .social-links {
    align-items: center;
  }
}
</style> 
