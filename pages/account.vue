<template>
  <div class="page-wrapper">
    <TheNavbar />
    
    <div class="content">
      <div class="account-header">
        <div class="header-content">
          <h1>My Account</h1>
          <p>Manage your profile, orders, and event bookings</p>
        </div>
      </div>

      <div v-if="!authStore.isAuthenticated" class="not-authenticated">
        <div class="auth-message">
          <h2>Please log in to view your account</h2>
          <p>You need to be logged in to access your account information.</p>
          <NuxtLink to="/login" class="login-button">
            Log In
          </NuxtLink>
        </div>
      </div>

      <div v-else class="account-content">
        <!-- Account Tabs -->
        <div class="account-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="{ active: activeTab === tab.id }"
            class="tab-button"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading your account information...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="loadAccountData" class="retry-button">Try Again</button>
        </div>

        <!-- Tab Content -->
        <div v-if="!loading && !error" class="tab-content">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="tab-panel">
            <div class="section-card">
              <h2>Profile Information</h2>
              <div class="profile-info">
                <div class="info-grid">
                  <div class="info-item">
                    <label>First Name</label>
                    <span>{{ user.firstName || authStore.user?.firstName || 'Loading...' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Last Name</label>
                    <span>{{ user.lastName || authStore.user?.lastName || 'Loading...' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Email</label>
                    <span>{{ user.email || authStore.user?.email || 'Loading...' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Account Type</label>
                    <span>{{ user.role || authStore.user?.role || 'Customer' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Member Since</label>
                    <span>{{ formatDate(user.createdAt || authStore.user?.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section-card">
              <h2>Account Statistics</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">{{ orders.length }}</div>
                  <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ events.length }}</div>
                  <div class="stat-label">Event Bookings</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">£{{ totalSpent.toFixed(2) }}</div>
                  <div class="stat-label">Total Spent</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ recentActivity }}</div>
                  <div class="stat-label">Days Since Last Order</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="tab-panel">
            <div class="section-card">
              <div class="section-header">
                <h2>Order History</h2>
                <div class="filter-controls">
                  <select v-model="orderStatusFilter" class="status-filter">
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div v-if="filteredOrders.length === 0" class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <NuxtLink to="/products" class="primary-button">
                  Start Shopping
                </NuxtLink>
              </div>

              <div v-else class="orders-list">
                <div v-for="order in filteredOrders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Order #{{ order.orderNumber }}</h3>
                      <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                    </div>
                    <div class="order-status">
                      <span :class="['status-badge', order.status]">{{ formatStatus(order.status) }}</span>
                      <div class="order-total">£{{ order.finalAmount.toFixed(2) }}</div>
                    </div>
                  </div>

                  <div class="order-items">
                    <div v-for="item in order.OrderItem" :key="item.id" class="order-item">
                      <div class="item-details">
                        <h4>{{ item.Product.name }}</h4>
                        <p class="item-quantity">Quantity: {{ item.quantity }} × £{{ item.unitPrice.toFixed(2) }}</p>
                        
                        <!-- Custom options -->
                        <div v-if="item.OrderItemOption && item.OrderItemOption.length > 0" class="item-options">
                          <p class="options-title">Customizations:</p>
                          <ul class="options-list">
                            <li v-for="option in item.OrderItemOption" :key="option.id">
                              <span class="option-name">{{ option.optionName }}:</span>
                              <!-- Color swatch for color options -->
                              <span v-if="isColorOption(option.optionName)" class="option-value color-option">
                                <span class="color-swatch-mini" :style="{ backgroundColor: getColorFromValue(option.value) }"></span>
                                {{ option.label || option.value }}
                              </span>
                              <!-- Regular text for non-color options -->
                              <span v-else class="option-value">{{ option.label || option.value }}</span>
                              <span v-if="option.priceAdjustment && option.priceAdjustment !== 0" class="price-adjustment">
                                ({{ option.priceAdjustment > 0 ? '+' : '' }}£{{ Math.abs(option.priceAdjustment).toFixed(2) }})
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="item-total">£{{ item.totalPrice.toFixed(2) }}</div>
                    </div>
                  </div>

                  <div v-if="order.customerNotes" class="order-notes">
                    <p><strong>Notes:</strong> {{ order.customerNotes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Tab -->
          <div v-if="activeTab === 'events'" class="tab-panel">
            <div class="section-card">
              <div class="section-header">
                <h2>Event Bookings</h2>
                <div class="filter-controls">
                  <select v-model="eventStatusFilter" class="status-filter">
                    <option value="">All Events</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div v-if="filteredEvents.length === 0" class="empty-state">
                <div class="empty-icon">🎉</div>
                <h3>No events found</h3>
                <p>You haven't booked any events yet.</p>
                <NuxtLink to="/booking" class="primary-button">
                  Book an Event
                </NuxtLink>
              </div>

              <div v-else class="events-list">
                <div v-for="event in filteredEvents" :key="event.id" class="event-card">
                  <div class="event-header">
                    <div class="event-info">
                      <h3>{{ event.eventType || 'Event Booking' }}</h3>
                      <p class="event-date">{{ formatDate(event.startDate) }}</p>
                      <p v-if="event.location" class="event-location">📍 {{ event.location }}</p>
                    </div>
                    <div class="event-status">
                      <span :class="['status-badge', event.status]">{{ formatStatus(event.status) }}</span>
                      <div class="event-total">£{{ event.totalAmount.toFixed(2) }}</div>
                    </div>
                  </div>

                  <div v-if="event.EventItem && event.EventItem.length > 0" class="event-items">
                    <div v-for="item in event.EventItem" :key="item.id" class="event-item">
                      <div class="item-details">
                        <h4>{{ item.Product.name }}</h4>
                        <p class="item-quantity">Quantity: {{ item.quantity }} × £{{ item.unitPrice.toFixed(2) }}</p>
                        
                        <!-- Custom options -->
                        <div v-if="item.EventItemOption && item.EventItemOption.length > 0" class="item-options">
                          <p class="options-title">Customizations:</p>
                          <ul class="options-list">
                            <li v-for="option in item.EventItemOption" :key="option.id">
                              <span class="option-name">{{ option.optionName }}:</span>
                              <!-- Color swatch for color options -->
                              <span v-if="isColorOption(option.optionName)" class="option-value color-option">
                                <span class="color-swatch-mini" :style="{ backgroundColor: getColorFromValue(option.value) }"></span>
                                {{ option.label || option.value }}
                              </span>
                              <!-- Regular text for non-color options -->
                              <span v-else class="option-value">{{ option.label || option.value }}</span>
                              <span v-if="option.priceAdjustment && option.priceAdjustment !== 0" class="price-adjustment">
                                ({{ option.priceAdjustment > 0 ? '+' : '' }}£{{ Math.abs(option.priceAdjustment).toFixed(2) }})
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="item-total">£{{ item.totalPrice.toFixed(2) }}</div>
                    </div>
                  </div>

                  <div v-if="event.description" class="event-description">
                    <p><strong>Description:</strong> {{ event.description }}</p>
                  </div>

                  <div v-if="event.guests" class="event-guests">
                    <p><strong>Expected Guests:</strong> {{ event.guests }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="tab-panel">
            <div class="section-card">
              <h2>Account Settings</h2>
              <div class="settings-content">
                <div class="setting-item">
                  <h3>Account Information</h3>
                  <p>Update your personal information and contact details.</p>
                  <button 
                    @click="openEditProfile" 
                    :disabled="!user.email && !authStore.user?.email"
                    class="secondary-button"
                  >
                    <span v-if="!user.email && !authStore.user?.email">Loading...</span>
                    <span v-else>Edit Profile</span>
                  </button>
                </div>

                <div class="setting-item">
                  <h3>Password</h3>
                  <p>Change your account password to keep your account secure.</p>
                  <button @click="openChangePassword" class="secondary-button">
                    Change Password
                  </button>
                </div>

                <div class="setting-item">
                  <h3>Email Preferences</h3>
                  <p>Manage your email notification preferences.</p>
                  <button class="secondary-button" disabled>
                    Manage Preferences (Coming Soon)
                  </button>
                </div>

                <div class="setting-item danger-zone">
                  <h3>Delete Account</h3>
                  <p><strong>Warning:</strong> This action is permanent and cannot be undone. All your data including orders, event bookings, and account information will be permanently deleted.</p>
                  <p class="legal-notice">This deletion complies with data protection regulations including GDPR. You have the right to have your personal data erased.</p>
                  <button @click="showDeleteConfirmation = true" class="danger-button">
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>

            <!-- Delete Account Confirmation Modal -->
            <div v-if="showDeleteConfirmation" class="modal-overlay" @click="cancelDelete">
              <div class="delete-modal" @click.stop>
                <div class="modal-header">
                  <h3>⚠️ Delete Account</h3>
                  <button @click="cancelDelete" class="close-modal-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div class="modal-content">
                  <div class="warning-box">
                    <h4>⚠️ This action is permanent and irreversible</h4>
                    <p>Deleting your account will permanently remove:</p>
                    <ul class="deletion-list">
                      <li>✗ Your profile and account information</li>
                      <li>✗ All order history ({{ orders.length }} order{{ orders.length !== 1 ? 's' : '' }})</li>
                      <li>✗ All event bookings ({{ events.length }} booking{{ events.length !== 1 ? 's' : '' }})</li>
                      <li>✗ All personal data and preferences</li>
                      <li>✗ Access to this account forever</li>
                    </ul>
                    <p><strong>This action cannot be undone.</strong></p>
                  </div>

                  <div class="confirmation-steps">
                    <div class="confirmation-step" :class="{ completed: step1Confirmed }">
                      <label class="confirmation-checkbox">
                        <input 
                          type="checkbox" 
                          v-model="step1Confirmed"
                          :disabled="isDeletingAccount"
                        >
                        <span class="checkmark"></span>
                        <span class="confirmation-text">I understand that this will permanently delete all my data</span>
                      </label>
                    </div>

                    <div class="confirmation-step" :class="{ completed: step2Confirmed }">
                      <label class="confirmation-checkbox">
                        <input 
                          type="checkbox" 
                          v-model="step2Confirmed"
                          :disabled="isDeletingAccount"
                        >
                        <span class="checkmark"></span>
                        <span class="confirmation-text">I understand that this action cannot be undone</span>
                      </label>
                    </div>

                    <div class="password-confirmation" v-if="step1Confirmed && step2Confirmed">
                      <label for="deletePassword">Enter your password to confirm:</label>
                      <div class="password-input-wrapper">
                        <input 
                          type="password" 
                          id="deletePassword"
                          v-model="deletePassword"
                          placeholder="Your account password"
                          :disabled="isDeletingAccount"
                          @keyup.enter="confirmDelete"
                          class="password-input"
                        >
                        <button 
                          type="button"
                          @click="showDeletePassword = !showDeletePassword"
                          class="toggle-password-btn"
                          :disabled="isDeletingAccount"
                        >
                          <svg v-if="!showDeletePassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        </button>
                      </div>
                      <p class="password-help">Your password is required for security purposes.</p>
                    </div>

                    <div v-if="deleteError" class="delete-error">
                      <p>{{ deleteError }}</p>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button @click="cancelDelete" class="cancel-delete-btn" :disabled="isDeletingAccount">
                    Cancel
                  </button>
                  <button 
                    @click="confirmDelete" 
                    class="confirm-delete-btn"
                    :disabled="!canDelete || isDeletingAccount"
                  >
                    <span v-if="isDeletingAccount">Deleting Account...</span>
                    <span v-else>Delete My Account Forever</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Account Deleted Success Modal -->
            <div v-if="accountDeleted" class="modal-overlay">
              <div class="success-modal">
                <div class="success-content">
                  <div class="success-icon">✓</div>
                  <h3>Account Deleted Successfully</h3>
                  <p>Your account and all associated data have been permanently deleted.</p>
                  <p>Thank you for using our service. You will be redirected to the homepage.</p>
                  <button @click="redirectToHome" class="primary-button">
                    Go to Homepage
                  </button>
                </div>
              </div>
            </div>

            <!-- Edit Profile Modal -->
            <div v-if="showEditProfile" class="modal-overlay" @click="cancelEditProfile">
              <div class="edit-profile-modal" @click.stop>
                <div class="modal-header">
                  <h3>✏️ Edit Profile</h3>
                  <button @click="cancelEditProfile" class="close-modal-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div class="modal-content">
                  <form @submit.prevent="saveProfile" class="edit-profile-form">
                    <div class="form-group">
                      <label for="editFirstName">First Name *</label>
                      <input 
                        type="text" 
                        id="editFirstName"
                        v-model="editForm.firstName"
                        placeholder="Enter your first name"
                        :disabled="isUpdatingProfile"
                        required
                        class="form-input"
                      >
                    </div>

                    <div class="form-group">
                      <label for="editLastName">Last Name *</label>
                      <input 
                        type="text" 
                        id="editLastName"
                        v-model="editForm.lastName"
                        placeholder="Enter your last name"
                        :disabled="isUpdatingProfile"
                        required
                        class="form-input"
                      >
                    </div>

                    <div class="form-group">
                      <label for="editEmail">Email Address *</label>
                      <input 
                        type="email" 
                        id="editEmail"
                        v-model="editForm.email"
                        placeholder="Enter your email address"
                        :disabled="isUpdatingProfile"
                        required
                        class="form-input"
                      >
                      <p v-if="isEmailChanged" class="email-change-warning">
                        ⚠️ Changing your email address will require password confirmation below.
                      </p>
                    </div>

                    <div v-if="isEmailChanged" class="form-group password-required">
                      <label for="editCurrentPassword">Current Password *</label>
                      <div class="password-input-wrapper">
                        <input 
                          :type="showCurrentPassword ? 'text' : 'password'"
                          id="editCurrentPassword"
                          v-model="editForm.currentPassword"
                          placeholder="Enter your current password"
                          :disabled="isUpdatingProfile"
                          required
                          class="form-input"
                        >
                        <button 
                          type="button"
                          @click="showCurrentPassword = !showCurrentPassword"
                          class="toggle-password-btn"
                          :disabled="isUpdatingProfile"
                        >
                          <svg v-if="!showCurrentPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        </button>
                      </div>
                      <p class="password-help">Required when changing email address for security purposes.</p>
                    </div>

                    <div v-if="editProfileError" class="edit-profile-error">
                      <p>{{ editProfileError }}</p>
                    </div>
                  </form>
                </div>

                <div class="modal-footer">
                  <button @click="cancelEditProfile" type="button" class="cancel-btn" :disabled="isUpdatingProfile">
                    Cancel
                  </button>
                  <button 
                    @click="saveProfile" 
                    type="button"
                    class="save-profile-btn"
                    :disabled="!canSaveProfile"
                  >
                    <span v-if="isUpdatingProfile">Updating Profile...</span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Change Password Modal -->
            <div v-if="showChangePassword" class="modal-overlay" @click="cancelChangePassword">
              <div class="change-password-modal" @click.stop>
                <div class="modal-header">
                  <h3>🔐 Change Password</h3>
                  <button @click="cancelChangePassword" class="close-modal-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div class="modal-content">
                  <div v-if="changePasswordSuccess" class="password-success">
                    <div class="success-icon">✓</div>
                    <p>{{ changePasswordSuccess }}</p>
                  </div>

                  <form v-else @submit.prevent="savePassword" class="change-password-form">
                    <div class="form-group">
                      <label for="currentPasswordInput">Current Password *</label>
                      <div class="password-input-wrapper">
                        <input 
                          :type="showPasswords.current ? 'text' : 'password'"
                          id="currentPasswordInput"
                          v-model="passwordForm.currentPassword"
                          placeholder="Enter your current password"
                          :disabled="isChangingPassword"
                          required
                          class="form-input"
                        >
                        <button 
                          type="button"
                          @click="showPasswords.current = !showPasswords.current"
                          class="toggle-password-btn"
                          :disabled="isChangingPassword"
                        >
                          <svg v-if="!showPasswords.current" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="newPasswordInput">New Password *</label>
                      <div class="password-input-wrapper">
                        <input 
                          :type="showPasswords.new ? 'text' : 'password'"
                          id="newPasswordInput"
                          v-model="passwordForm.newPassword"
                          placeholder="Enter your new password"
                          :disabled="isChangingPassword"
                          required
                          class="form-input"
                          :class="{ 'input-error': passwordForm.newPassword && !passwordValidation.newPasswordLength }"
                        >
                        <button 
                          type="button"
                          @click="showPasswords.new = !showPasswords.new"
                          class="toggle-password-btn"
                          :disabled="isChangingPassword"
                        >
                          <svg v-if="!showPasswords.new" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        </button>
                      </div>
                      <div class="password-requirements">
                        <div class="requirement" :class="{ 'valid': passwordValidation.newPasswordLength }">
                          <span class="requirement-icon">{{ passwordValidation.newPasswordLength ? '✓' : '○' }}</span>
                          At least 6 characters long
                        </div>
                        <div class="requirement" :class="{ 'valid': passwordValidation.passwordsDifferent }">
                          <span class="requirement-icon">{{ passwordValidation.passwordsDifferent ? '✓' : '○' }}</span>
                          Different from current password
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="confirmPasswordInput">Confirm New Password *</label>
                      <div class="password-input-wrapper">
                        <input 
                          :type="showPasswords.confirm ? 'text' : 'password'"
                          id="confirmPasswordInput"
                          v-model="passwordForm.confirmPassword"
                          placeholder="Confirm your new password"
                          :disabled="isChangingPassword"
                          required
                          class="form-input"
                          :class="{ 'input-error': passwordForm.confirmPassword && !passwordValidation.passwordsMatch }"
                        >
                        <button 
                          type="button"
                          @click="showPasswords.confirm = !showPasswords.confirm"
                          class="toggle-password-btn"
                          :disabled="isChangingPassword"
                        >
                          <svg v-if="!showPasswords.confirm" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        </button>
                      </div>
                      <div v-if="passwordForm.confirmPassword" class="password-match">
                        <div class="requirement" :class="{ 'valid': passwordValidation.passwordsMatch }">
                          <span class="requirement-icon">{{ passwordValidation.passwordsMatch ? '✓' : '✗' }}</span>
                          {{ passwordValidation.passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
                        </div>
                      </div>
                    </div>

                    <div v-if="changePasswordError" class="change-password-error">
                      <p>{{ changePasswordError }}</p>
                    </div>
                  </form>
                </div>

                <div v-if="!changePasswordSuccess" class="modal-footer">
                  <button @click="cancelChangePassword" type="button" class="cancel-btn" :disabled="isChangingPassword">
                    Cancel
                  </button>
                  <button 
                    @click="savePassword" 
                    type="button"
                    class="save-password-btn"
                    :disabled="!canChangePassword"
                  >
                    <span v-if="isChangingPassword">Changing Password...</span>
                    <span v-else>Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

// Define page metadata
// definePageMeta({
//   middleware: 'auth'
// })

const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const activeTab = ref('profile')
const loading = ref(false)
const error = ref(null)
const orders = ref([])
const events = ref([])
const user = ref({})

// Filter states
const orderStatusFilter = ref('')
const eventStatusFilter = ref('')

// Delete account states
const showDeleteConfirmation = ref(false)
const step1Confirmed = ref(false)
const step2Confirmed = ref(false)
const deletePassword = ref('')
const showDeletePassword = ref(false)
const isDeletingAccount = ref(false)
const deleteError = ref('')
const accountDeleted = ref(false)

// Edit profile states
const showEditProfile = ref(false)
const isUpdatingProfile = ref(false)
const editProfileError = ref('')
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  currentPassword: ''
})
const showCurrentPassword = ref(false)
const emailChanged = ref(false)

// Change password states
const showChangePassword = ref(false)
const isChangingPassword = ref(false)
const changePasswordError = ref('')
const changePasswordSuccess = ref('')
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const showPasswords = ref({
  current: false,
  new: false,
  confirm: false
})

// Tab configuration
const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'events', label: 'Events', icon: '🎉' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

// Computed properties
const filteredOrders = computed(() => {
  if (!orderStatusFilter.value) return orders.value
  return orders.value.filter(order => order.status === orderStatusFilter.value)
})

const filteredEvents = computed(() => {
  if (!eventStatusFilter.value) return events.value
  return events.value.filter(event => event.status === eventStatusFilter.value)
})

const totalSpent = computed(() => {
  const orderTotal = orders.value.reduce((sum, order) => sum + (order.finalAmount || 0), 0)
  const eventTotal = events.value.reduce((sum, event) => sum + (event.totalAmount || 0), 0)
  return orderTotal + eventTotal
})

const recentActivity = computed(() => {
  const allDates = [
    ...orders.value.map(order => new Date(order.createdAt)),
    ...events.value.map(event => new Date(event.createdAt))
  ]
  
  if (allDates.length === 0) return 'N/A'
  
  const mostRecent = Math.max(...allDates)
  const daysSince = Math.floor((Date.now() - mostRecent) / (1000 * 60 * 60 * 24))
  return daysSince
})

// Delete account computed property
const canDelete = computed(() => {
  return step1Confirmed.value && 
         step2Confirmed.value && 
         deletePassword.value.trim().length > 0 && 
         !isDeletingAccount.value
})

// Edit profile computed properties
const isEmailChanged = computed(() => {
  return editForm.value.email !== user.value.email
})

const canSaveProfile = computed(() => {
  const form = editForm.value
  const hasRequiredFields = form.firstName.trim() && form.lastName.trim() && form.email.trim()
  const hasPasswordIfEmailChanged = !isEmailChanged.value || form.currentPassword.trim()
  
  return hasRequiredFields && hasPasswordIfEmailChanged && !isUpdatingProfile.value
})

// Change password computed properties
const canChangePassword = computed(() => {
  const form = passwordForm.value
  const hasAllFields = form.currentPassword.trim() && form.newPassword.trim() && form.confirmPassword.trim()
  const passwordsMatch = form.newPassword === form.confirmPassword
  const passwordsAreDifferent = form.currentPassword !== form.newPassword
  const newPasswordValid = form.newPassword.length >= 6
  
  return hasAllFields && passwordsMatch && passwordsAreDifferent && newPasswordValid && !isChangingPassword.value
})

const passwordValidation = computed(() => {
  const form = passwordForm.value
  const validation = {
    newPasswordLength: form.newPassword.length >= 6,
    passwordsMatch: form.newPassword === form.confirmPassword,
    passwordsDifferent: form.currentPassword !== form.newPassword || !form.currentPassword || !form.newPassword
  }
  return validation
})

// Methods
const loadAccountData = async () => {
  loading.value = true
  error.value = null

  try {
    // Load user info - always populate from auth store first
    if (authStore.user) {
      user.value = { ...authStore.user }
      console.log('User data loaded from auth store:', user.value)
    } else {
      // If no user in store, fetch from API
      const userResponse = await authStore.fetchUser()
      if (userResponse) {
        user.value = userResponse
        console.log('User data fetched from API:', user.value)
      }
    }

    // Load orders and events in parallel
    await Promise.all([
      loadOrders(),
      loadEvents()
    ])
  } catch (err) {
    console.error('Error loading account data:', err)
    error.value = 'Failed to load account information. Please try again.'
  } finally {
    loading.value = false
  }
}

const loadOrders = async () => {
  try {
    const response = await fetch('/api/orders/user')
    
    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Failed to fetch orders')
    }

    const result = await response.json()
    if (result.success) {
      orders.value = result.data || []
    }
  } catch (err) {
    console.error('Error loading orders:', err)
  }
}

const loadEvents = async () => {
  try {
    const response = await fetch('/api/bookings/user')
    
    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Failed to fetch events')
    }

    const result = await response.json()
    if (result.success) {
      events.value = result.data || []
    }
  } catch (err) {
    console.error('Error loading events:', err)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

// Helper function to check if an option is a color option
const isColorOption = (optionName) => {
  const colorKeywords = ['color', 'colour']
  return colorKeywords.some(keyword => optionName.toLowerCase().includes(keyword))
}

// Helper function to get color from a value
const getColorFromValue = (value) => {
  // Convert color names to hex values
  const colorMap = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'yellow': '#eab308',
    'green': '#22c55e',
    'purple': '#a855f7',
    'pink': '#ec4899',
    'orange': '#f97316',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'brown': '#92400e',
    'navy': '#1e3a8a',
    'teal': '#14b8a6',
    'lime': '#84cc16',
    'indigo': '#6366f1',
    'cyan': '#06b6d4',
    'rose': '#f43f5e',
    'amber': '#f59e0b',
    'emerald': '#10b981',
    'slate': '#475569',
    'zinc': '#71717a',
    'neutral': '#737373',
    'stone': '#78716c'
  }
  
  const normalizedValue = value.toLowerCase().trim()
  
  // Check if it's already a hex color
  if (normalizedValue.startsWith('#')) {
    return normalizedValue
  }
  
  // Check if it's a CSS color name
  if (colorMap[normalizedValue]) {
    return colorMap[normalizedValue]
  }
  
  // Default to a neutral color if not found
  return '#6b7280'
}

// Delete account methods
const cancelDelete = () => {
  showDeleteConfirmation.value = false
  step1Confirmed.value = false
  step2Confirmed.value = false
  deletePassword.value = ''
  showDeletePassword.value = false
  deleteError.value = ''
  isDeletingAccount.value = false
}

const confirmDelete = async () => {
  if (!canDelete.value) {
    return
  }
  
  isDeletingAccount.value = true
  deleteError.value = ''
  
  try {
    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        confirmDelete: true,
        password: deletePassword.value
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to delete account')
    }
    
    if (result.success) {
      // Clear auth store
      authStore.user = null
      
      // Show success modal
      showDeleteConfirmation.value = false
      accountDeleted.value = true
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        redirectToHome()
      }, 5000)
    } else {
      throw new Error(result.message || 'Failed to delete account')
    }
    
  } catch (error) {
    console.error('Error deleting account:', error)
    deleteError.value = error.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isDeletingAccount.value = false
  }
}

const redirectToHome = () => {
  navigateTo('/')
}

// Edit profile methods
const openEditProfile = () => {
  // Pre-fill form with current user data - try multiple sources
  const currentUser = user.value || authStore.user || {}
  
  console.log('Opening edit profile dialog')
  console.log('Current user data:', currentUser)
  console.log('Auth store user:', authStore.user)
  console.log('Local user value:', user.value)
  
  // Ensure we have user data before opening the modal
  if (!currentUser.email) {
    console.warn('No user data available for pre-filling form')
    editProfileError.value = 'Unable to load current user information. Please try refreshing the page.'
    return
  }
  
  editForm.value = {
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
    currentPassword: ''
  }
  
  console.log('Form pre-filled with values:', editForm.value)
  
  editProfileError.value = ''
  showCurrentPassword.value = false
  showEditProfile.value = true
}

const cancelEditProfile = () => {
  showEditProfile.value = false
  isUpdatingProfile.value = false
  editProfileError.value = ''
  editForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: ''
  }
  showCurrentPassword.value = false
}

const saveProfile = async () => {
  if (!canSaveProfile.value) {
    return
  }
  
  isUpdatingProfile.value = true
  editProfileError.value = ''
  
  try {
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: editForm.value.firstName.trim(),
        lastName: editForm.value.lastName.trim(),
        email: editForm.value.email.toLowerCase().trim(),
        currentPassword: editForm.value.currentPassword
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to update profile')
    }
    
    if (result.success) {
      // Update local user data
      user.value = { ...user.value, ...result.data }
      
      // Update auth store if needed
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...result.data }
      }
      
      // Close modal
      showEditProfile.value = false
      
      // Show success message (you could add a toast notification here)
      console.log('Profile updated successfully')
      
    } else {
      throw new Error(result.message || 'Failed to update profile')
    }
    
  } catch (error) {
    console.error('Error updating profile:', error)
    editProfileError.value = error.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isUpdatingProfile.value = false
  }
}

// Change password methods
const openChangePassword = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswords.value = {
    current: false,
    new: false,
    confirm: false
  }
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  showChangePassword.value = true
}

const cancelChangePassword = () => {
  showChangePassword.value = false
  isChangingPassword.value = false
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswords.value = {
    current: false,
    new: false,
    confirm: false
  }
}

const savePassword = async () => {
  if (!canChangePassword.value) {
    return
  }
  
  isChangingPassword.value = true
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
        confirmPassword: passwordForm.value.confirmPassword
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to change password')
    }
    
    if (result.success) {
      changePasswordSuccess.value = 'Password changed successfully!'
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        showChangePassword.value = false
      }, 2000)
      
    } else {
      throw new Error(result.message || 'Failed to change password')
    }
    
  } catch (error) {
    console.error('Error changing password:', error)
    changePasswordError.value = error.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isChangingPassword.value = false
  }
}

// Hash change handler function
const handleHashChange = () => {
  const hash = window.location.hash.substring(1) // Remove the # symbol
  if (hash && tabs.some(tab => tab.id === hash)) {
    activeTab.value = hash
    console.log('Switched to tab from hash change:', hash)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('Account page mounted')
  console.log('Initial auth state:', authStore.isAuthenticated)
  console.log('Initial user data:', authStore.user)
  
  // Handle URL hash for tab switching
  const hash = window.location.hash.substring(1) // Remove the # symbol
  if (hash && tabs.some(tab => tab.id === hash)) {
    activeTab.value = hash
    console.log('Switched to tab from URL hash:', hash)
  }
  
  // Initialize user data immediately if available in auth store
  if (authStore.user && Object.keys(authStore.user).length > 0) {
    user.value = { ...authStore.user }
    console.log('Pre-populated user data from auth store:', user.value)
  }
  
  // First, try to fetch user if not authenticated
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, trying to fetch user...')
    await authStore.fetchUser()
  }
  
  // If still not authenticated after fetching, redirect to login
  if (!authStore.isAuthenticated) {
    console.log('Still not authenticated, redirecting to login')
    await navigateTo('/login')
    return
  }
  
  // If authenticated, load account data
  console.log('User is authenticated, loading account data')
  await loadAccountData()
  console.log('Account data loaded, user:', user.value)
  
  // Add hash change listener
  window.addEventListener('hashchange', handleHashChange)
})

// Cleanup hash change listener on unmount
onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

// Watch for user data changes to ensure it's available
watch(() => [user.value, authStore.user], ([newUser, newAuthUser]) => {
  if (newUser && Object.keys(newUser).length > 0) {
    console.log('Local user data updated:', newUser)
  }
  if (newAuthUser && Object.keys(newAuthUser).length > 0) {
    console.log('Auth store user data updated:', newAuthUser)
    // Sync auth store data to local user if local is empty
    if (!user.value || Object.keys(user.value).length === 0) {
      user.value = { ...newAuthUser }
      console.log('Synced auth store data to local user:', user.value)
    }
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.content {
  flex: 1;
  padding-top: 80px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  box-sizing: border-box;
}

.account-header {
  text-align: center;
  padding: 4rem 0;
  background: var(--service-card-bg);
  margin-bottom: 3rem;
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--accent-primary);
}

.header-content p {
  font-size: 1.2rem;
  color: var(--text-primary);
  opacity: 0.9;
}

.not-authenticated {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.auth-message {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.auth-message h2 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.auth-message p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.login-button {
  display: inline-block;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.account-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.account-tabs {
  display: flex;
  background: var(--card-bg);
  border-radius: 12px 12px 0 0;
  border: 1px solid var(--border-color);
  border-bottom: none;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  border-right: 1px solid var(--border-color);
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.tab-button.active {
  background: var(--accent-primary);
  color: white;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-label {
  font-weight: 600;
}

.tab-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 12px 12px;
  min-height: 400px;
}

.tab-panel {
  padding: 2rem;
}

.section-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.section-card:last-child {
  margin-bottom: 0;
}

.section-card h2 {
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-controls select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.profile-info .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.info-item span {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.primary-button {
  display: inline-block;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.primary-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.orders-list, .events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card, .event-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.order-card:hover, .event-card:hover {
  box-shadow: 0 4px 12px var(--shadow-color);
}

.order-header, .event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.order-info h3, .event-info h3 {
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.order-date, .event-date, .event-location {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.order-status, .event-status {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #d39e00;
}

.status-badge.confirmed {
  background: rgba(40, 167, 69, 0.2);
  color: #27a745;
}

.status-badge.completed {
  background: rgba(32, 201, 151, 0.2);
  color: #20c997;
}

.status-badge.cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.order-total, .event-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.order-items, .event-items {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}

.order-item, .event-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
}

.order-item:last-child, .event-item:last-child {
  border-bottom: none;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.item-quantity {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-options {
  margin-top: 0.75rem;
}

.options-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.options-list li {
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.option-name {
  font-weight: 500;
}

.option-value {
  margin-left: 0.5rem;
}

.color-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch-mini {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.color-swatch-mini[style*="rgb(255, 255, 255)"],
.color-swatch-mini[style*="#ffffff"],
.color-swatch-mini[style*="#fff"] {
  border-color: #e5e7eb;
}

.price-adjustment {
  color: var(--accent-primary);
  font-weight: 500;
}

.item-total {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.order-notes, .event-description, .event-guests {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-item {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
}

.setting-item h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.setting-item p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.secondary-button {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-button:hover:not(:disabled) {
  background: var(--hover-bg);
}

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-zone {
  border-color: #dc3545;
}

.danger-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-button:hover:not(:disabled) {
  background: #c82333;
}

.danger-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-radius: 50%;
  border-top-color: var(--accent-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: var(--error-color, #ef4444);
}

.retry-button {
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.legal-notice {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.25rem;
}

/* Edit Profile Modal Styles */
.edit-profile-modal {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.email-change-warning {
  color: #f59e0b;
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.password-required {
  background: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.05);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid rgba(var(--accent-primary-rgb, 184, 134, 11), 0.2);
}

.edit-profile-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 6px;
  padding: 1rem;
}

.edit-profile-error p {
  color: #dc3545;
  margin: 0;
  font-weight: 500;
}

.cancel-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--hover-bg);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-profile-btn {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 140px;
}

.save-profile-btn:hover:not(:disabled) {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-1px);
}

.save-profile-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6c757d;
  transform: none;
}

/* Delete Account Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.delete-modal, .success-modal {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  color: #dc3545;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-modal-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-modal-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.modal-content {
  padding: 1.5rem;
}

.warning-box {
  background: rgba(220, 53, 69, 0.05);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.warning-box h4 {
  color: #dc3545;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.warning-box p {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.deletion-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.deletion-list li {
  color: #dc3545;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.confirmation-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.confirmation-step {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.confirmation-step.completed {
  border-color: var(--accent-primary);
  background: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.05);
}

.confirmation-checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  gap: 0.75rem;
}

.confirmation-checkbox input {
  width: auto;
  margin: 0;
  padding: 0;
}

.confirmation-checkbox .checkmark {
  position: relative;
  top: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.confirmation-checkbox input:checked ~ .checkmark {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.confirmation-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.confirmation-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.confirmation-text {
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.4;
}

.password-confirmation {
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 2px solid var(--accent-primary);
}

.password-confirmation label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.password-input-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.password-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.toggle-password-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toggle-password-btn:hover {
  color: var(--text-primary);
  background: var(--hover-bg);
}

.password-help {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.delete-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.delete-error p {
  color: #dc3545;
  margin: 0;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.cancel-delete-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-delete-btn:hover:not(:disabled) {
  background: var(--hover-bg);
}

.cancel-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 180px;
}

.confirm-delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.confirm-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6c757d;
}

.success-modal {
  max-width: 400px;
}

.success-content {
  padding: 2rem;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.success-content h3 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.success-content p {
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* Change Password Modal Styles */
.change-password-modal {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.password-success {
  text-align: center;
  padding: 2rem 1rem;
}

.password-success .success-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
}

.password-success p {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.password-requirements {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.password-match {
  margin-top: 0.5rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.requirement.valid {
  color: #28a745;
}

.requirement-icon {
  font-weight: bold;
  width: 16px;
  text-align: center;
}

.input-error {
  border-color: #dc3545 !important;
}

.input-error:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.change-password-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.change-password-error p {
  color: #dc3545;
  margin: 0;
  font-weight: 500;
}

.save-password-btn {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 160px;
}

.save-password-btn:hover:not(:disabled) {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-1px);
}

.save-password-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6c757d;
  transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2.5rem;
  }

  .account-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1 1 50%;
  }

  .tab-panel {
    padding: 1.5rem;
  }

  .section-card {
    padding: 1.5rem;
  }

  .order-header, .event-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-status, .event-status {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .order-item, .event-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .account-content {
    padding: 0 1rem 4rem;
  }

  .tab-button {
    flex: 1 1 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .tab-button:last-child {
    border-bottom: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Responsive adjustments for modals */
@media (max-width: 480px) {
  .delete-modal, .success-modal, .edit-profile-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header, .modal-content, .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .cancel-delete-btn, .confirm-delete-btn, .cancel-btn, .save-profile-btn {
    width: 100%;
  }
  
  .confirmation-checkbox {
    align-items: flex-start;
  }
  
  .password-input, .form-input {
    font-size: 16px; /* Prevent zoom on mobile */
  }
}
</style> 